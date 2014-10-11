###
@author Gilad Gray
@license MIT

Many thanks to kirbysayshi for inspiration and code samples.
@see https://github.com/kirbysayshi/pocket-ces
###

_ = require './fn.coffee'
System = require './system.coffee'

class Pocket
  @System: System

  constructor: ->
    @time = 0
    @_componentTypes = {}

    @_keys = {}
    @_labels = {}
    @_systems = []
    @_components = {}

    @_keysToDestroy = {}

  ### KEYS ###

  ###*
   * Store a new key in the Pocket.
   * @param  {Object} components mapping of component or label names to initial values
   * @return {String}            ID of new key
  ###
  key: (components) ->
    # generate a unique ID unless one is given
    id = components.id ? _.uniqueId('key-')
    if components.id && @_keys[components.id]
      console.warn "discarding component id #{components.id}"
      id = _.uniqueId('key-')

    @_keys[id] = id

    # add a new entry for this key to each component it uses
    for name, component of components
      @addComponentToKey id, name, component

    return id

  ###*
   * Convenience method to add a series of keys at once.
   * @see Pocket::key
   * @param  {Array<Object>} keys an array or splat of key definitions
   * @return {Array<String>}      IDs of new keys
  ###
  keys: (keys...) ->
    @key(cmps) for cmps in _.flatten(keys)

  ###*
   * Returns an array of all keys currently in the pocket.
   * @return {Array<String>} all the keys in the pocket
  ###
  getKeys: -> Object.keys @_keys

  destroyKey: (id) -> @_keysToDestroy[id] = true

  destroyKeys: (ids...) -> @destroyKey(id) for id in _.flatten ids

  ###*
   * Deletes key entry and all component data about it.
   * This operation is UNSAFE, prefer using {::destroyKey} which allows the
   * Pocket to delete keys at its earliest, safe convenience.
  ###
  immediatelyDestroyKey: (id) ->
    unless @_keys[id]
      throw new Error("key with id #{id} already destroyed")
    delete @_keys[id]
    for name, cmp of @_components
      delete @_components[name][id]

  ### COMPONENTS ###

  ###*
   * Register a new named component type in the Pocket.
   * @param {String} name        name of component
   * @param {Function, Object} initializer component initializer function
   *   `(component, options) -> void` or default options object
  ###
  component: (name, initializer) ->
    if _.isFunction initializer
      # noop
    else if _.isObject initializer
      defaults = initializer
      do (defaults) ->
        initializer = (comp, options={}) ->
          _.defaults comp, _.clone(defaults, true)
          _.merge comp, options
    unless _.isFunction initializer
      throw new Error 'Unexpected component initializer type. Must be function or object.'
    @_componentTypes[name] = initializer
    @_components[name] = {}
    return

  ###*
   * Convenience function to define several components at once.
   * @see Pocket::component
   * @param  {Object} components mapping of names to initializers
  ###
  components: (components) ->
    @component(name, initializer) for name, initializer of components
    return

  ###*
   * Returns the state of the given component, for testing only.
   * @param {String} name component name
   * @return {Object} component state: mapping of keys to their component values
  ###
  getComponent: (name) -> @_components[name]

  ###*
   * Returns the contents of the first key associated with the component name.
   * @param {String} name name of component to query for data
  ###
  getData: (name) ->
    data = @_components[name]
    return data[Object.keys(data)[0]]

  dataFor: (key, name) -> @_components[name]?[key]

  ### KEYS + COMPONENTS ###

  ###*
   * Adds a new instance to the given component under the given ID with options
   * @param {String} id            id of key
   * @param {String} componentName name of component
   * @param {Object} options       options for component initializer
  ###
  addComponentToKey: (id, componentName, options) ->
    unless @_keys[id]
      throw new Error "could not find key with id #{id}"

    component = @_components[componentName] ?= {}
    cmpEntry = component[id]

    unless cmpEntry
      # add a new entry for this key
      cmpEntry = component[id] = {}
      cmpInitializer = @_componentTypes[componentName]
      if cmpInitializer
        # initialize the component with user options
        cmpInitializer(cmpEntry, options ? {})
      else if !@_labels[componentName]
        @_labels[componentName] = true
        console.log "Found no component definition for '#{componentName}', assuming it's a label."
    return

  ###*
   * Returns an array of keys that contain all the given components.
   * @param {Array<String>} componentArray array or splat of component names
   * @return {Array<String>} array of matching key IDs
  ###
  filterKeys: (componentArray...) ->
    names = _.flatten componentArray
    matching = []
    # loop through keys of first component table (if exists) to quickly prune number of
    # keys we have to search. (if they're not in the first table then they'll never work!)
    table0 = @_components[names.shift()]
    return matching unless table0
    # build up list of all keys that pass the 'has all components' test
    for id of table0
      hasAll = true
      for name in names
        unless @_components[name]?[id]?
          hasAll = false
          break
      matching.push(id) if hasAll
    return matching

  ### SYSTEMS ###

  ###*
   * Register a new System in the Pocket.
   * @param  {String}        name name of the system
   * @param  {Array<String>} reqs array of required component names
   * @param  {Function}      fn   system action function, invoked with
   *                              (pocket, keys[], cName1{}, ..., cNameN{})
  ###
  system: (name, reqs, fn) ->
    @_systems.push if name instanceof System then name else new System(name, reqs, fn)

  ###*
   * Register a new System in the Pocket that calls its function *for each* key
   * that matches the requirements, to reduce boilerplate.
   * @param {String}        name name of the system
   * @param {Array<String>} reqs array of required component names
   * @param {Function}      fn   system action function for each key, invoked with
   *                             (pocket, key, cValue1, ..., cValueN)
  ###
  systemForEach: (name, reqs, fn) -> @system System.forEach(name, reqs, fn)

  ###*
   * Internal: Returns array with all system names
  ###
  getSystems: -> _.pluck @_systems, 'name'

  # delete all keys marked for deletion
  _destroyMarkedKeys: ->
    for key of @_keysToDestroy
      @immediatelyDestroyKey key
      delete @_keysToDestroy[key] # TODO: can this be done in loop?

  # run all registered, valid systems
  _runSystems: ->
    for system in @_systems
      # reqs contains all keys that have any of the names
      reqs = system.requiredComponents.map (name) => @_components[name] or {}
      # keys contains keys that have all components
      keys = @filterKeys system.requiredComponents
      # run the action!
      system.action @, keys, reqs...

  ###*
   * Perform one tick of the Pocket environment: destroy marked keys and run all systems.
   * This function is intended to be wrapped in a `requestAnimationFrame` loop so it will
   * be run every frame.
   * @param {DOMHighResTimeStamp} time a timestamp from `requestAnimationFrame`
  ###
  tick: (time) ->
    if time?
      @delta = time - @time
      @time  = time
    @_destroyMarkedKeys()
    @_runSystems()
    return

module.exports = Pocket
