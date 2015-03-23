addLoadFunction(function()
{
	get('translate-toggle').onclick = function(e)
	{
		if (e.target.classList.contains('toggle-off'))
		{
			e.target.className = 'button button-small toggle-on';
			get('search-toggle').className = 'button button-small toggle-off'
			get('search').setAttribute('placeholder', 'Translate...')
		}
	}

	get('search-toggle').onclick = function(e)
	{
		if (e.target.classList.contains('toggle-off'))
		{
			e.target.className = 'button button-small toggle-on';
			get('translate-toggle').className = 'button button-small toggle-off'
			get('search').setAttribute('placeholder', 'Search...')
		}
	}

	get('view-chat').onclick = function(e)
	{
		var pane = get('chatpane')
		if (pane.style.right == '' || pane.style.right == '-300px')
		{
			pane.style.right = 0
		}
		else
		{
			pane.style.right = '-300px'
			var drawing = get('drawing')
			drawing.removeAttribute('class')
			drawing.innerHTML = ''
		}
	}

	get('content').onclick = function()
	{
		var pane = get('chatpane')
		pane.style.right = '-300px'
		var drawing = get('drawing')
		drawing.removeAttribute('class')
		drawing.innerHTML = ''
	}
})