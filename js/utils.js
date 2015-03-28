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
