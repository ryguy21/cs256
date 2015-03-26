addLoadFunction(function()
{
	var dropdown = get('chatroom-selector')
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
		get('create-room-name').value = ''

		dropdown.appendChild(room)
		dropdown.className = 'dropdown closed'
	}

	get('create-room').onclick = function()
	{
		var name = get('create-room-name').value
		if (name != '')
		{
			createRoom(name)
		}
	}

	get('create-room-name').onkeyup = function(e)
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

	function SendChat()
	{
		var canvas = get('current-canvas')
		textInput = get('chat-text-input')
		var text = textInput.value
		if (text == '' && (canvas == null || get('current-drawing').innerHTML == ''))
		{
			return
		}

		textInput.value = ''

		var chat = document.createElement('div')
		chat.className = 'chat'

		if (canvas != null && get('current-drawing').innerHTML != '')
		{
			var drawingBox = document.createElement('div')
			drawingBox.className = 'drawing'

			canvas.removeAttribute('id')

			var drawing = canvas.childNodes[0]
			drawing.removeAttribute('id')

			var width = canvas.width.baseVal.value
			var height = canvas.height.baseVal.value
			closeDrawingPane()

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
			canvas.setAttribute('data-done', true)

			drawingBox.appendChild(canvas)
			chat.appendChild(drawingBox)
		}

		var username = 'Rob'
		var name = document.createElement('span')
		name.className = 'username'
		name.innerText = username
		chat.appendChild(name)
		chat.appendChild(document.createTextNode(' ' + text))

		var chatbox = get('chatbox')
		chatbox.appendChild(chat)
		chatbox.scrollTop = chatbox.scrollHeight

		if (closeDrawingPane)
		{
			closeDrawingPane()
		}
	}

	get('view-chat').onclick = openChatPane
	get('content').onclick = closeChatPane
	get('send-chat').onclick = SendChat
	get('chat-text-input').onkeyup = function(e)
	{
		if (e.keyCode == 13)
		{
			SendChat()
		}
	}
})

function openChatPane()
{
	var pane = get('chatpane')
	if (pane.style.right == '' || pane.style.right == '-300px')
	{
		pane.style.right = 0
		get('view-chat').className = 'button chat-button open'
	}
	else
	{
		closeChatPane()
	}
}

function closeChatPane()
{
	get('chatpane').style.right = '-300px'
	var drawing = get('drawing')
	get('view-chat').className = 'button chat-button'

	if (closeDrawingPane)
	{
		closeDrawingPane()
	}
}