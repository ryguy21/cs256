SVGNS = 'http://www.w3.org/2000/svg'

function get(id)
{
	return document.getElementById(id)
}

var loadFunctions = []

function addLoadFunction(f)
{
	loadFunctions.push(f)
}

window.onload = function(e)
{
	for (var i in loadFunctions)
	{
		loadFunctions[i](e)
	}
}
