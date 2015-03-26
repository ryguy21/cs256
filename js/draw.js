addLoadFunction(function()
{
	get('create-drawing').onclick = function()
	{
		var drawing = get('drawing')
		if (drawing.classList.contains('show'))
		{
			closeDrawingPane()
		}
		else
		{
			drawing.className = 'show'
			get('drawing-background').className = 'show'
			createDrawingPane()
		}
	}

	get('cancel-drawing').onclick = closeDrawingPane
	get('clear-drawing').onclick = function()
	{
		get('current-drawing').innerHTML = ''
	}

	var tools = get('drawing-tools').querySelectorAll('.button')
	for (var i in tools)
	{
		var tool = tools[i]

		if (!tool.setAttribute)
		{
			continue
		}

		if (tool.id == 'cancel-drawing' || tool.id == 'clear-drawing')
		{
			return
		}

		tool.setAttribute('data-index', i)

		tool.onclick = function(e)
		{
			var t = e.target
			var index = t.getAttribute('data-index')
			for (var o in tools)
			{
				if (o != index)
				{
					tools[o].className = 'button toggle-off'
				}
			}

			t.className = 'button toggle-on'
			var type = t.getAttribute('data-tool')
			get('drawing-tools').setAttribute('data-tool', type)
			get('canvas-container').className = type
		}
	}
})

function closeDrawingPane()
{
	var drawing = get('drawing')
	drawing.removeAttribute('class')
	get('drawing-background').removeAttribute('class')
	get('canvas-container').innerHTML = ''

	drawing.onmousedown = drawing.ontouchstart = undefined
	drawing.onmousemove = drawing.ontouchmove = undefined
	drawing.onmouseup = drawing.ontouchend = undefined
}

function createDrawingPane()
{
	var svg = document.createElementNS(SVGNS, 'svg')
	svg.setAttribute('width', '100%')
	svg.setAttribute('height', '100%')
	svg.setAttribute('id', 'current-canvas')
	var g = document.createElementNS(SVGNS, 'g')
	g.id = 'current-drawing'
	createCanvas(g)

	svg.appendChild(g)
	get('canvas-container').appendChild(svg)
}

function createCanvas(canvas)
{
	var drawing = get('drawing')
	var curves = null

	function addPoint(e)
	{
		if (e instanceof TouchEvent && e.touches.length < 1)
		{
			return
		}

		var pt = {
			x: e.x || e.clientX || e.touches[0].clientX,
			y: e.y || e.clientY || e.touches[0].clientY
		}

		pt.x -= drawing.offsetLeft
		pt.y -= drawing.offsetTop

		for (var i in curves)
		{
			var type = curves[i]
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

	function drawCurve(curve, pt, options)
	{
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

		var d = curve.getAttribute('d')
		d += 'L' + pt.x + ',' + pt.y
		curve.setAttribute('d', d)
		return curve
	}

	function createCurves()
	{
		var tool = get('drawing-tools').getAttribute('data-tool')
		if (tool == 'zz')
		{
			return [{
					curve:null,
					dx:0,
					dy:0,
					stroke:5
				}]
		}
		if (tool == 'eraser')
		{
			return [{
				curve:null,
				dx:0,
				dy:0,
				stroke:30,
				color:'#fff'
			}]
		}

		var cs = []

		for (var d = -5; d <= 5; d++)
		{
			cs.push({
				curve:null,
				dx:getDx(d, tool),
				dy:getDy(d, tool)
			})
		}

		return cs
	}

	function getDx(d, tool)
	{
		if (tool.indexOf('z') < 0)
		{
			d *= 0.71
		}

		if (tool.charAt(0) == 'p')
		{
			return d
		}
		else if (tool.charAt(0) == 'n')
		{
			return -d
		}
		else
		{
			return 0
		}
	}

	function getDy(d, tool)
	{
		if (tool.indexOf('z') < 0)
		{
			d *= 0.71
		}

		if (tool.charAt(1) == 'p')
		{
			return d
		}
		else if (tool.charAt(1) == 'n')
		{
			return -d
		}
		else
		{
			return 0
		}
	}

	function drawStart(e)
	{
		curves = createCurves()
		addPoint(e)
	}

	function drawEnd(e)
	{
		addPoint(e)
		curves = null
	}

	drawing.onmousedown = drawing.ontouchstart = drawStart
	drawing.onmousemove = drawing.ontouchmove = addPoint
	drawing.onmouseup = drawing.ontouchend = drawEnd
}