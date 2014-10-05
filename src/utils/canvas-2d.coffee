###*
 * A component definition for a 2D canvas graphics provider. Given a selector for a canvas element,
 * stores a reference to the CanvasRenderingContext2D, its width and height, and a center vector.
 * Automatically updates canvas size if one or both dimensions are set to 'auto'.
 *
 * A `canvas-2d` component defines several keys:
 * - **`canvas`** - the canvas element that is being rendered to
 * - **`width`** - the width of the canvas, in pixels
 * - **`height`** - the height of the canvas, in pixels
 * - **`g2d`** - a CanvasRenderingContext2D graphics drawing surface
 * - **`camera`** - a 2D vector representing the location of the 'camera'. the component does not
 * 									actually use this value, but instead provides it in a central place for your
 * 									game to modify and for your rendering systems to use.
 *
 * @example
 *   # require and register the component
 *   pocket.component 'canvas-2d', require('pocket/utils/canvas-2d.coffee')
 *   # define a key with the canvas-2d component and your options
 *   pocket.key {
 *   	 'canvas-2d':
 *   	 	 canvas: '#game'
 *   	 	 width:  800
 *   	 	 height: 600
 *   }
 *   # use pocket.getData in a system to get the component data and draw some graphics!
 *   pocket.systemForEach 'draw-squares', ['position', 'square'], (p, k, {x, y}, {size, color}) ->
 *   	 {g2d} = p.getData 'canvas-2d'
 *   	 g2d.fillStyle = color
 *   	 g2d.fillRect x, y, size, size
 *
 * @param  {Object}       cmp    component entry
 * @option {String}       canvas CSS selector for canvas element (default: `'#canvas'`)
 * @option {Integer|auto} width  width of canvas element, or 'auto' to match window width
 *         											 (default: `'auto'`)
 * @option {Integer|auto} height height of canvas element, or 'auto' to match window height
 *         											 (default: `'auto'`)
###
Canvas2D = (cmp, {canvas, width, height}) ->
  autoWidth  = width is 'auto'
  autoheight = height is 'auto'
  cmp.canvas = document.querySelector canvas or 'canvas'
  cmp.g2d = cmp.canvas.getContext('2d')
  cmp.camera = {x: 0, y: 0}

  # ensure canvas is as large as possible
  window.addEventListener 'resize', resize = ->
    cmp.width  = cmp.canvas.width  = if autoWidth  then document.body.clientWidth  else width
    cmp.height = cmp.canvas.height = if autoheight then document.body.clientHeight else height
  resize()

module.exports = Canvas2D
