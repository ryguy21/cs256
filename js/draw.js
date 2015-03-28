/*
 * This file describes the functionality of the drawing pane, including opening and closing it,
 * setting the controls, and actually drawing.
 */

addLoadFunction(function()
{
	// event handler for when user clicks on the 'draw' button in the chat pane
	get('create-drawing').onclick = function()
	{
		var drawing = get('drawing')

		// if it's already open then close it
		if (drawing.classList.contains('show'))
		{
			closeDrawingPane()
		}
		else // open the drawing pane
		{
			// show the pane
			drawing.className = 'show'
			get('drawing-background').className = 'show'

			// create a new SVG canvas
			createDrawingCanvas()
		}
	}

	// event handlers for the special controls on the drawing pane
	get('cancel-drawing').onclick = closeDrawingPane
	get('clear-drawing').onclick = function()
	{
		get('current-drawing').innerHTML = ''
	}

	// ****************************************************************
	// set up event handlers for all the tools
	// ****************************************************************

	var tools = get('drawing-tools').querySelectorAll('.button')
	for (var i in tools)
	{
		var tool = tools[i]

		// probably not necessary, but can't hurt
		if (!tool.setAttribute)
		{
			continue
		}

		// we don't want to attach these event handlers to the special tool buttons
		if (tool.id == 'cancel-drawing' || tool.id == 'clear-drawing')
		{
			return
		}

		// we want to be sure we have the right item, and relying on scope doesn't work well in loops
		tool.setAttribute('data-index', i)

		// when the user clicks a control...
		tool.onclick = function(e)
		{
			var t = e.target
			var index = t.getAttribute('data-index')

			// toggle off all other buttons...
			for (var o in tools)
			{
				if (o != index)
				{
					tools[o].className = 'button toggle-off'
				}
			}

			// toggle on this button!
			t.className = 'button toggle-on'
			var type = t.getAttribute('data-tool')

			// update the drawing to use the correct tool
			get('drawing-tools').setAttribute('data-tool', type)
			get('canvas-container').className = type
		}
	}
})

function closeDrawingPane()
{
	var drawing = get('drawing')
	drawing.removeAttribute('class') // removes the 'show' class, see draw.css:11, 34-38
	get('drawing-background').removeAttribute('class')
	get('canvas-container').innerHTML = ''

	// remove event listeners! We dont' want duplicates
	drawing.onmousedown = drawing.ontouchstart = undefined
	drawing.onmousemove = drawing.ontouchmove = undefined
	drawing.onmouseup = drawing.ontouchend = undefined
}

function createDrawingCanvas()
{
	// SVG elements need to be created with the SVG namespace
	var svg = document.createElementNS(SVGNS, 'svg')
	svg.setAttribute('width', '100%')
	svg.setAttribute('height', '100%')
	svg.id = 'current-canvas'
	var g = document.createElementNS(SVGNS, 'g')
	g.id = 'current-drawing'
	createCanvasEventHandlers(g)

	// add the newly created SVG element to the drawing area
	svg.appendChild(g)
	get('canvas-container').appendChild(svg)
}

function createCanvasEventHandlers(canvas)
{
	var drawing = get('drawing')

	// the list of curves for each action. To make the different strokes, each tool
	// creates multiple curves close to each other to make it look like a non-uniform brush
	var curves = null

	// this method adds the point contained in the event e to the current list of curves
	function addPoint(e)
	{
		// touchend events don't have a point associated with them
		if (e instanceof TouchEvent && e.touches.length < 1)
		{
			return
		}

		var pt = {
			x: e.x || e.clientX || e.touches[0].clientX,
			y: e.y || e.clientY || e.touches[0].clientY
		}

		// the coordinates above are based on the web page, we want them to be based on the canvas
		pt.x -= drawing.offsetLeft
		pt.y -= drawing.offsetTop

		for (var i in curves)
		{
			var type = curves[i]

			// modify the point based on the current curve type
			var np = modifyPoint(pt, type)
			type.curve = drawCurve(type.curve, np, type)
		}
	}

	function modifyPoint(pt, type)
	{
		return {
			x: pt.x + type.dx,
			y: pt.y + type.dy
		}
	}

	// add the given point to the curve
	function drawCurve(curve, pt, options)
	{
		// if the curve hasn't been created yet, create it!
		if (curve == null)
		{
			curve = document.createElementNS(SVGNS, 'path')
			curve.setAttribute('d', 'M' + pt.x + ',' + pt.y)
			curve.setAttribute('fill', 'none')
			curve.setAttribute('stroke-linecap', 'round')
			curve.setAttribute('stroke', options.color || 'black')
			curve.setAttribute('stroke-width', options.stroke || 5)
			canvas.appendChild(curve)
			return curve
		}

		// simply put a line between each point. This could use curves if we wanted to, but that
		// would be a lot of work and this looks pretty decent as it is
		var d = curve.getAttribute('d')
		d += 'L' + pt.x + ',' + pt.y
		curve.setAttribute('d', d)
		return curve
	}

	// create all the curves associated with the currently selected tool
	function createCurves()
	{
		// tool names are based on three letters: z, n, and p. They are associated with
		// whether the dx or dy values will change for each subcurve. p means a positive
		// change, n means a negative change, and z means no change. The first letter is
		// the x change, the second is the y change.
		var tool = get('drawing-tools').getAttribute('data-tool')

		// here the tool is simply a point, so we don't need to create multiple subcurves
		if (tool == 'zz')
		{
			return [{
					curve:null,
					dx:0,
					dy:0,
					stroke:5
				}]
		}

		// the eraser is a special tool with one subcurve that's really big and white (the
		// same color as the background)
		if (tool == 'eraser')
		{
			return [{
				curve:null,
				dx:0,
				dy:0,
				stroke:30,
				color:'white'
			}]
		}

		var cs = []

		// dx and dy values can range from -5 to 5
		for (var d = -5; d <= 5; d++)
		{
			cs.push({
				curve:null,
				dx:getDval(d, tool, 0),
				dy:getDval(d, tool, 1)
			})
		}

		return cs
	}

	function getDval(d, tool, index)
	{
		// if this tool is diagonal, reduce d by sqrt(2)-ish
		if (tool.indexOf('z') < 0)
		{
			d *= 0.71
		}

		// character is p, therefore positive relationship
		if (tool.charAt(index) == 'p')
		{
			return d
		}

		// character is n, therefore negative relationship
		else if (tool.charAt(index) == 'n')
		{
			return -d
		}

		// character is z, therefore always 0
		else
		{
			return 0
		}
	}

	// when the user presses down, create the curve objects and add the first point
	function drawStart(e)
	{
		curves = createCurves()
		addPoint(e)
	}

	// when the user releases, add the last point and destroy the curve objects
	function drawEnd(e)
	{
		addPoint(e)
		curves = null
	}

	// event handlers, compatible with both touch events and mouse events
	drawing.onmousedown = drawing.ontouchstart = drawStart
	drawing.onmousemove = drawing.ontouchmove = addPoint
	drawing.onmouseup = drawing.ontouchend = drawEnd
}