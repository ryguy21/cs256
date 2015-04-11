/*
 * This file lays out all the JavaScript used in the chat bar, but it does not include
 * the code for the drawing mechanism.
 */

// do all this stuff when the page loads
addLoadFunction(function()
{
	// ****************************************************************
	// Define the chatroom list dropdown functionality
	// ****************************************************************

	var dropdown = get('chatroom-selector')
	var nodes = dropdown.childNodes

	// add the event handlers for each chat room list item
	function createDropdownClickMethod(e)
	{
		e.onclick = function(e)
		{
			// when an item is clicked, open the dropdown if it is closed
			if (dropdown.classList.contains('closed'))
			{
				dropdown.className = 'dropdown open'
			}
			else // close the dropdown and set this item as the selected one
			{
				dropdown.className = 'dropdown closed'

				// remove the selected class from the previously selected item
				document.getElementsByClassName('dropdown-item selected')[0].className = 'dropdown-item'

				e.target.className = 'dropdown-item selected'
			}
		}
	}

	// go through the dropdown items and add event listeners o them
	for (var i in nodes)
	{
		e = nodes[i]

		// don't add an event listener if it has an 'unselectable' class
		if (e.nodeType == e.TEXT_NODE || e.classList.contains('unselectable'))
		{
			continue
		}

		createDropdownClickMethod(e)
	}

	// create a new chat room of the given name
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

	// event listener for when the user clicks on the 'Create' button
	get('create-room').addEventListener('click', function()
	{
		var name = get('create-room-name').value

		// if the name isn't empty create the room
		if (name != '')
		{
			createRoom(name)
		}
	})

	// event listener so the user can hit enter to create a new room
	get('create-room-name').addEventListener('keydown', stopEvent)
	get('create-room-name').addEventListener('keyup', function(e)
	{
		// if they hit enter
		if (e.keyCode == 13)
		{
			var name = e.target.value

			// if the name isn't empty create the room
			if (name != '')
			{
				createRoom(name)
			}
		}

		stopEvent(e)
		return false
	})

	// ****************************************************************
	// Define the chat functionality
	// ****************************************************************

	// take the text in the input and the drawing (if any) and send them as a chat
	function SendChat()
	{
		var canvas = get('current-canvas') // drawing canvas (actual SVG element)
		textInput = get('chat-text-input') // chat text input
		var text = textInput.value

		// if there's nothing to send, don't send it
		if (text == '' && (canvas == null || get('current-drawing').innerHTML == ''))
		{
			return
		}

		// clear text input
		textInput.value = ''

		// create chat element
		var chat = document.createElement('div')
		chat.className = 'chat'

		// fake username, should get this legitimately
		var username = 'Rob'

		// create username element
		var name = document.createElement('span')
		name.className = 'username'
		name.innerText = username
		chat.appendChild(name)

		// append chat text
		chat.appendChild(document.createTextNode(' ' + text))

		// next, add the drawing if any
		if (canvas != null && get('current-drawing').innerHTML != '')
		{
			// create drawing container for chat list
			var drawingBox = document.createElement('div')
			drawingBox.className = 'drawing'

			// remove IDs from drawing so when new drawing is made they aren't mixed up
			canvas.removeAttribute('id')
			var drawing = canvas.childNodes[0]
			drawing.removeAttribute('id')

			// get the size of the drawing before we close the drawing panel
			var width = canvas.width.baseVal.value
			var height = canvas.height.baseVal.value
			closeDrawingPane()

			// scale the drawing down to fit the chat list
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

			// position the drawing in the chat element
			var canvasWidth = width * scale
			canvas.setAttribute('width', canvasWidth + 'px')
			canvas.setAttribute('height', (height * scale) + 'px')
			canvas.setAttribute('style', 'margin-left:' + ((250 - canvasWidth) / 2) + 'px')

			// mark the drawing as complete, so future drawings don't draw on top of this one
			canvas.setAttribute('data-done', true)

			// add the drawing to the chat
			drawingBox.appendChild(canvas)
			chat.appendChild(drawingBox)
		}



		// append the newly created chat element to the chat box
		var chatbox = get('chatbox')
		chatbox.appendChild(chat)

		// scroll the chatbox to the bottom so the user can see the new chat
		chatbox.scrollTop = chatbox.scrollHeight

		// close the drawing panel
		if (closeDrawingPane)
		{
			closeDrawingPane()
		}
	}

	get('view-chat').onclick = function()
	{
		if (closeDrawingPane)
		{
			var drawingClosed = closeDrawingPane()
			if (!drawingClosed)
			{
				openChatPane()
			}
		}
	}

	get('send-chat').onclick = SendChat
	get('send-drawing').onclick = SendChat
	get('chat-text-input').addEventListener('keydown', stopEvent)
	get('chat-text-input').addEventListener('keyup', function(e)
	{
		if (e.keyCode == 13)
		{
			SendChat()
		}

		stopEvent(e)
		return false
	})
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