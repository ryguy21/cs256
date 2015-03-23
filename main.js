SVGNS = 'http://www.w3.org/2000/svg'
var test = 0

function getElement(id)
{
	return document.getElementById(id)
}

window.onload = function(e)
{
	getElement('translate-toggle').onclick = function(e)
	{
		if (e.target.classList.contains('toggle-off'))
		{
			e.target.className = 'button button-small toggle-on';
			getElement('search-toggle').className = 'button button-small toggle-off'
			getElement('search').setAttribute('placeholder', 'Translate...')
		}
	}

	getElement('search-toggle').onclick = function(e)
	{
		if (e.target.classList.contains('toggle-off'))
		{
			e.target.className = 'button button-small toggle-on';
			getElement('translate-toggle').className = 'button button-small toggle-off'
			getElement('search').setAttribute('placeholder', 'Search...')
		}
	}

	getElement('view-chat').onclick = function(e)
	{
		var pane = getElement('chatpane')
		if (pane.style.right == '' || pane.style.right == '-300px')
		{
			pane.style.right = 0
		}
		else
		{
			pane.style.right = '-300px'
			var drawing = getElement('drawing')
			drawing.removeAttribute('class')
			drawing.innerHTML = ''
		}
	}

	getElement('content').onclick = function()
	{
		var pane = getElement('chatpane')
		pane.style.right = '-300px'
		var drawing = getElement('drawing')
		drawing.removeAttribute('class')
		drawing.innerHTML = ''
	}

	var dropdown = getElement('chatroom-selector')
	var nodes = dropdown.childNodes

	function createDropdownClickMethod(e)
	{
		e.onclick = function(e)
		{
			if (dropdown.classList.contains('closed'))
			{
				dropdown.className = 'dropdown open'
			}
			else
			{
				dropdown.className = 'dropdown closed'
				document.getElementsByClassName('dropdown-item selected')[0].className = 'dropdown-item'
				e.target.className = 'dropdown-item selected'
			}
		}
	}

	for (var i in nodes)
	{
		e = nodes[i]
		if (e.nodeType == e.TEXT_NODE || e.classList.contains('unselectable'))
		{
			continue
		}

		createDropdownClickMethod(e)
	}

	function createRoom(name)
	{
		document.getElementsByClassName('dropdown-item selected')[0].className = 'dropdown-item'

		var room = document.createElement('div')
		room.className = 'dropdown-item selected'
		room.innerText = name
		createDropdownClickMethod(room)
		getElement('create-room-name').value = ''

		dropdown.appendChild(room)
		dropdown.className = 'dropdown closed'
	}

	getElement('create-room').onclick = function()
	{
		var name = getElement('create-room-name').value
		if (name != '')
		{
			createRoom(name)
		}
	}

	getElement('create-room-name').onkeyup = function(e)
	{
		if (e.keyCode == 13)
		{
			var name = e.target.value
			if (name != '')
			{
				createRoom(name)
			}
		}
	}

	getElement('create-drawing').onclick = function(e)
	{
		var drawing = getElement('drawing')
		if (drawing.classList.contains('show'))
		{
			drawing.className = ''
			drawing.innerHTML = ''
		}
		else
		{
			drawing.className = 'show'
			var svg = document.createElementNS(SVGNS, 'svg')
			svg.setAttribute('width', '100%')
			svg.setAttribute('height', '100%')
			svg.setAttribute('id', 'current-canvas')
			var g = document.createElementNS(SVGNS, 'g')
			g.setAttribute('id', 'current-drawing')
			svg.appendChild(g)
			drawing.appendChild(svg)

			if (!test)
			{
				var path = document.createElementNS(SVGNS, 'path')
				path.setAttribute('d', 'm325,15c-2,0 -10.0979,1.79896 -39,16c-32.11034,15.77741 -61.92191,29.71584 -93,53c-27.87302,20.88288 -45.14795,40.65179 -52,61c-7.76482,23.05879 -7.17604,42.20261 1,59c10.32898,21.22057 41.95212,37.07806 68,53c27.94887,17.08392 47.51025,26.32422 61,40c8.00687,8.11728 10.86752,16.07584 10,21c-2.03079,11.52719 -16.97269,24.92609 -36,45c-20.92268,22.07355 -49.08313,46.28094 -71,61c-16.37332,10.99609 -33.0381,19.98822 -48,26c-11.47746,4.61172 -23,5 -31,5c-6,0 -8.48626,0.17624 -9,-2c-2.06778,-8.75925 -1.52954,-25.29001 3,-45c3.75444,-16.33719 8.76267,-29.05042 11,-39c2.71368,-12.06796 3.95768,-20.41748 8,-29c4.0198,-8.5347 9.96436,-16.0307 16,-23c6.95909,-8.03561 14.84778,-18.13861 32,-26c27.60329,-12.65143 57.62704,-18.49118 107,-22c38.90189,-2.76468 83.12381,-2.18533 120,1c41.28296,3.56598 80.68796,17.10999 118,27c29.77753,7.89288 55.90033,15.94928 80,18c21.94342,1.86725 35.00684,0.11719 44,-9c8.00684,-8.11728 13.73126,-19.58707 18,-28c4.87341,-9.60468 6.65442,-25.07855 10,-39c3.6275,-15.09441 7.55786,-24.14345 11,-34c1.77545,-5.08406 4.05145,-8.29869 3,-10c-3.52673,-5.70634 -15.77368,-8.75967 -26,-16c-10.98016,-7.77406 -16.51422,-14.99754 -26,-19c-9.61908,-4.0587 -18.00305,-5.29147 -32,-5c-24.01563,0.50011 -42.98419,3.81487 -56,19c-11.06348,12.90736 -14.49994,36.98958 -15,73c-0.72202,51.995 -0.34259,106.24142 7,166c5.31305,43.24084 12.2702,86.97253 16,125c3.2345,32.97784 3,63 3,87c0,18 -1.5885,31.15424 -10,40c-7.85687,8.26251 -28.36923,17.9826 -57,26c-33.42725,9.36053 -82.78885,18.375 -124,24c-38.84442,5.30194 -75.98987,9.49994 -113,10c-24.99771,0.33777 -40,0 -46,0c-2,0 -3,-1 -3,-6c0,-4 7.62675,-18.12109 25,-38c22.33525,-25.55652 44.82552,-44.27002 58,-60c6.42084,-7.66632 8.94373,-10.23663 8,-12c-1.70129,-3.17889 -13.97504,-4.49969 -29,-5c-19.98892,-0.66559 -44,0 -77,0c-22,0 -47.10205,-0.20624 -66,2c-11.10492,1.29645 -24.07668,2.31647 -36,4c-5.04894,0.71289 -9.18601,1.69257 -11,3c-1.14727,0.8269 -0.91231,3.03064 -2,6c-1.85227,5.05658 -2.49755,7.92578 -3,13c-0.29561,2.98541 -0.50731,6.02435 -1,11c-0.50245,5.07422 -2,10 -2,15c0,8 -0.51243,13.13043 1,18c2.25893,7.27307 8.89351,13.19672 18,18c13.84463,7.30249 31.36542,13.21045 45,20c14.43393,7.18762 29.18185,12.5174 43,18c16.23317,6.4408 29.11656,11.69293 40,16c7.08142,2.80243 13.91573,6.42645 23,8c7.94397,1.37598 18.06078,4.51276 28,6c10.08575,1.50916 18.9516,3.34503 32,5c9.97,1.26453 23,1 34,1c11,0 21.41522,0.91241 31,-4c11.60318,-5.94696 20.55228,-14.63019 33,-23c9.67761,-6.5072 20.52048,-13.13123 31,-20c9.53592,-6.25031 20.17252,-15.89056 29,-30c14.28125,-22.82642 20.80588,-43.03961 26,-68c7.71222,-37.06104 12.16641,-60.97974 12,-85c-0.12491,-18.02734 -4.16187,-31.8248 -15,-42c-14.00461,-13.14801 -28.09595,-18.798 -43,-26c-16.10663,-7.78311 -32.51111,-15.80811 -59,-22c-36.49942,-8.53189 -74.02191,-10.84952 -102,-15c-26.02113,-3.86017 -44.03995,-5.79428 -60,-9c-14.03746,-2.81955 -30.95584,-5.22748 -51,-9c-16.96481,-3.19296 -40.90177,-7.64432 -55,-18c-9.70483,-7.12854 -19.76396,-19.41159 -25,-27c-7.11612,-10.31314 -11.33593,-19.84067 -15,-28c-4.41213,-9.82513 -6.2709,-17.90356 -9,-26c-3.33481,-9.89337 -5.34686,-18.92987 -7,-28c-1.2679,-6.95648 -4,-21 -4,-33c0,-12 0,-25 0,-35c0,-13 3.13764,-29.27777 9,-46c7.86379,-22.43124 16.14001,-37.50117 24,-50c7.24068,-11.51402 17.08732,-17.84262 28,-24c12.0993,-6.82692 27.80492,-12.58433 45,-18c17.81866,-5.61208 38,-9 59,-9c20,0 46.42654,3.00668 66,12c23.57306,10.83099 49.11993,26.764 67,36c15.10394,7.80199 26.26599,11.13901 34,14c4.19434,1.55159 8,3 11,3c5,0 12.89172,-2.19576 20,-6c5.91446,-3.16531 9.83505,-6.11329 14,-12c2.88785,-4.0817 8.37146,-9.80538 14,-21c6.43167,-12.79194 9.63712,-25.8306 12,-36c1.37668,-5.92493 1,-10 1,-15c0,-3 -3.77637,-6.40894 -9,-9c-4.82428,-2.39297 -9.02521,-2.88134 -14,-4c-4.02264,-0.90456 -10,-2 -15,-2c-5,0 -9,0 -13,0c-2,0 -4,0 -7,0c-3,0 -5.87857,-0.49346 -9,-1c-2.96127,-0.48055 -6,-1 -8,-2c-2,-1 -3.82443,-0.09789 -5,-2c-1.05145,-1.7013 -2.48627,-3.82375 -3,-6c-0.4595,-1.9465 -1,-4 -1,-6c0,-2 0.02676,-4.77025 1,-5c2.17624,-0.51374 6,-1 11,-1c10,0 18.6113,1.89682 27,5c7.73401,2.86099 15,4 20,5c5,1 10,2 16,2c5,0 9.02249,0.36655 12,0c4.09222,-0.50377 8.92578,-1.49755 14,-2c4.97568,-0.49269 9.93796,-1.49829 16,-2c3.98636,-0.32992 8,0 12,0c6,0 15.00745,-0.29888 21,0c10.03738,0.50062 16.95795,1.13081 23,3c6.9549,2.15159 10.71198,2.98162 16,4c3.9278,0.75643 8,0 11,0c3,0 5.02673,0.22975 6,0c2.17627,-0.51374 3,-1 5,-1c1,0 3.69342,-0.4588 5,-1c1.84778,-0.76537 3,0 3,-1l1,0')
				path.setAttribute('stroke-width', '5')
				path.setAttribute('stroke', '#000')
				path.setAttribute('fill', 'none')
				g.appendChild(path)

				test = 1
			}
		}
	}

	function SendChat()
	{
		var canvas = getElement('current-canvas')
		textInput = getElement('chat-text-input')
		var text = textInput.value
		if (text == '' && canvas == null)
		{
			return
		}

		textInput.value = ''

		var chat = document.createElement('div')
		chat.className = 'chat'

		if (canvas != null)
		{
			var drawingBox = document.createElement('div')
			drawingBox.className = 'drawing'

			canvas.removeAttribute('id')

			var drawing = canvas.childNodes[0]
			drawing.removeAttribute('id')

			var width = canvas.width.baseVal.value
			var height = canvas.height.baseVal.value
			var canvasBox = getElement('drawing')
			canvasBox.removeChild(canvas)
			canvasBox.className = ''

			console.log(width, height)

			var scale = 1.0
			if (width > height)
			{
				scale = 250 / width
			}
			else
			{
				scale = 250 / height
			}
			drawing.setAttribute('transform', 'scale(' + scale + ')')

			var canvasWidth = width * scale
			canvas.setAttribute('width', canvasWidth + 'px')
			canvas.setAttribute('height', (height * scale) + 'px')
			canvas.setAttribute('style', 'margin-left:' + ((250 - canvasWidth) / 2) + 'px')

			drawingBox.appendChild(canvas)
			chat.appendChild(drawingBox)

		}

		var username = 'Rob'
		var name = document.createElement('span')
		name.className = 'username'
		name.innerText = username
		chat.appendChild(name)
		chat.appendChild(document.createTextNode(' ' + text))

		var chatbox = getElement('chatbox')
		chatbox.appendChild(chat)
		chatbox.scrollTop = chatbox.scrollHeight
	}

	getElement('send-chat').onclick = SendChat
	getElement('chat-text-input').onkeyup = function(e)
	{
		if (e.keyCode == 13)
		{
			SendChat()
		}
	}

	function Comment(text)
	{
		var text = getElement('comment-text').value
		if (text == '')
		{
			return
		}

		var comment = document.createElement('div')
		comment.className = 'comment'
		comment.onclick = commentClick

		var username = document.createElement('span')
		username.className = 'username'
		username.innerText = 'Rob'
		comment.appendChild(username)
		comment.appendChild(document.createTextNode(text))

		getElement('comment-text').value = ''

		var box = getElement('comment-feed')
		box.appendChild(comment)
		box.scrollTop = box.scrollHeight
	}

	getElement('send-comment').onclick = Comment
	getElement('comment-text').onkeyup = function(e)
	{
		if (e.keyCode == 13)
		{
			Comment()
		}
	}

	function moveSliderTo(x)
	{
		var track = getElement('video-track')
		x -= 10

		x = Math.min(Math.max(x, 0), track.offsetWidth)

		getElement('track-slider').style.left = (x + 3) + 'px'

		var down = x / track.offsetWidth
		var chatbox = getElement('comment-feed')
		var height = chatbox.scrollHeight
		var top = height * down
		chatbox.scrollTop = top
	}

	getElement('video-track').onclick = function(e)
	{
		var x = e.x || e.clientX
		moveSliderTo(x)
	}

	var sliderPressed = false
	function sliderPress()
	{
		sliderPressed = true

		var content = getElement('content')
		content.onmousemove = sliderDrag
		content.onmouseup = sliderRelease
	}

	function sliderRelease()
	{
		sliderPressed = false
	}

	function sliderDrag(e)
	{
		if (!sliderPressed)
		{
			return
		}

		var x = e.x || e.clientX
		moveSliderTo(x)
	}

	getElement('track-slider').onmousedown = sliderPress

	function commentClick(e)
	{
		var comment = e.target
		var box = getElement('comment-feed')
		var top = comment.offsetTop - comment.offsetHeight
		var down = top / box.offsetHeight
		var x = getElement('video-track').offsetWidth * down
		x += 10
		moveSliderTo(x)
	}

	var comments = document.getElementsByClassName('comment')
	for (var i in comments)
	{
		comments[i].onclick = commentClick
	}

	var tags = document.getElementsByClassName('tag')
	for (var i in tags)
	{
		tags[i].onclick = commentClick
	}
}
