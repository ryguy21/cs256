/*
 * This file is simply a list of utility variables and functions.
 */

SVGNS = 'http://www.w3.org/2000/svg'

// just so we don't have to write document.getEl... so much!
function get(id)
{
	return document.getElementById(id)
}

var loadFunctions = []

// this method adds the given function to a list of functions to be run once the page loads.
// We should NOT use window.onload, because it would override this and mess up the whole page!
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

function pad(num, size) {
    var s = num + ''
    while (s.length < size) s = "0" + s
    return s
}

function scale(x, x0, x1, y0, y1)
{
	return (((x - x0) * (y1 - y0)) / (x1 - x0)) + y0
}


// ================================================================
// methods for radio buttons
// ================================================================

addLoadFunction(function()
{
	var sets = document.querySelectorAll('.radio-container')
	for (var i = 0; i < sets.length; i++)
	{
		var options = sets[i].querySelectorAll('.radio-item')

		for (var j = 0; j < options.length; j++)
		{
			var option = options[j]
			option.setAttribute('data-index', j)
			option.addEventListener('click', function(e)
			{
				e.target.className += ' selected'
				var options = e.target.parentNode.querySelectorAll('.radio-item')
				var j = e.target.getAttribute('data-index')

				for (var k = 0; k < options.length; k++)
				{
					if (k != j)
					{
						options[k].className = options[k].className.replace('selected', '')
					}

					options[k].className.replace('  ', ' ')
				}
			})
		}
	}
})
