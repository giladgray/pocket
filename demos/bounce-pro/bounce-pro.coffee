random = (min, max) ->
  unless max?
    max = min
    min = 0
  return Math.floor(Math.random() * (max - min)) + min

# track number of balls on the screen
numBalls = 0
countElem = document.querySelector '.count'
updateCount = (delta) ->
  if delta then numBalls += delta
  else numBalls = 0
  countElem.textContent = numBalls

rocket = new Rocket

# context-2d component for storing CanvasRenderingContext2D and other canvas info
rocket.component 'context-2d', (cmp, {canvas}) ->
  cmp.canvas = document.querySelector canvas or '#canvas'
  cmp.g2d = cmp.canvas.getContext('2d')
  cmp.center = {x: 0, y: 0}

  # ensure canvas is as large as possible
  window.addEventListener 'resize', resize = ->
    cmp.canvas.width = document.body.clientWidth
    cmp.canvas.height = document.body.clientHeight
    cmp.width = cmp.canvas.width
    cmp.height = cmp.canvas.height
    cmp.center.x = cmp.canvas.width / 2
    cmp.center.y = cmp.canvas.height / 2
  resize()

# the context-2d data object
rocket.key {'context-2d': null}

# maintain keyboard state. this guy mutates himself, it's prety badass
rocket.component 'keyboard-state', (cmp, {target, keymap}) ->
  cmp.target = target or document
  cmp.down = {}
  # returns true if the named key was pressed in the last X milliseconds
  cmp.isNewPress = (keyName, recency = 16) ->
    downTime = cmp.down[keyName]
    delta = Date.now() - downTime
    return downTime and 0 < delta < recency

  cmp.target.addEventListener 'keydown', (e) ->
    keyName = keymap[e.which]
    cmp.down[e.which] = true
    if keyName and not cmp.down[keyName]
      # record time it was pressed
      cmp.down[keyName] = Date.now()

  cmp.target.addEventListener 'keyup', (e) ->
    keyName = keymap[e.which]
    cmp.down[e.which] = false
    if keyName
      cmp.down[keyName] = 0

# the keyboard-state data object
rocket.key
  'input': null
  'keyboard-state':
    keymap:
      13: 'ADD'
      32: 'DESTROY'

# keyboard commands
rocket.systemForEach 'input-balls', ['keyboard-state'], (rocket, key, keyboard) ->
  if keyboard.isNewPress 'DESTROY'
    rocket.destroyKeys rocket.filterKeys('ball')
    updateCount(0)
  if keyboard.isNewPress 'ADD'
    randomBall()

# ball components
rocket.component 'position', {x: 0, y: 0}
rocket.component 'velocity', {x: 0, y: 0}
rocket.component 'circle',   {radius: 30, color: 'red'}

# cycle through colors
colors = ['seagreen', 'navy', 'indigo', 'firebrick', 'goldenrod']
curColor = 0
nextColor = ->
  color = colors[curColor++]
  curColor %= colors.length
  return color

# make a ball with random attributes
randomBall = ->
  updateCount(1)
  {width, height} = rocket.getData 'context-2d'
  radius = random(20, 100)
  rocket.key {
    ball: true
    position :
      x: random(radius, width - radius)
      y: random(radius, height / 2 - radius)
    velocity : {x: random(-8, 8), y: 0}
    circle   : {radius, color: nextColor()}
  }

# start with 5 of them
randomBall() for i in [0...5]

### NOW IT'S IDENTICAL TO BOUNCE! DEMO ###

# apply gravity to every thing with a velocity
GRAVITY = 0.5
rocket.systemForEach 'gravity', ['velocity'], (rocket, key, vel) ->
  vel.y += GRAVITY

# move each ball
rocket.systemForEach 'move', ['position', 'velocity'], (rocket, key, pos, vel) ->
  pos.x += vel.x
  pos.y += vel.y

# clear the canvas each frame
rocket.system 'clear-canvas', [], (rocket) ->
  {g2d, width, height} = rocket.getData 'context-2d'
  g2d.clearRect 0, 0, width, height

# draw each balls
rocket.systemForEach 'draw-ball', ['position', 'circle'], (rocket, key, pos, circle) ->
  {g2d} = rocket.getData 'context-2d'
  g2d.beginPath()
  g2d.fillStyle = circle.color
  g2d.arc pos.x, pos.y, circle.radius, 0, Math.PI * 2
  g2d.closePath()
  g2d.fill()

# bounce each ball when they reach the edge of the canvas
rocket.systemForEach 'bounce', ['position', 'velocity', 'circle'], (pkt, key, pos, vel, {radius}) ->
  {width, height} = pkt.getData 'context-2d'
  if pos.x < radius or pos.x > width - radius
    vel.x *= -1
    pos.x += vel.x
  if pos.y < radius or pos.y > height - radius
    vel.y *= -1
    pos.y += vel.y

# render loop
start = (time) ->
  rocket.tick(time)
  window.requestAnimationFrame start

document.addEventListener 'DOMContentLoaded', -> start()
