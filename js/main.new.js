// i know a lot of this code is messy and redundant, but it works
addLoadFunction(function()
{
	function sortByChapter(){
		var recent_act = document.getElementById("recent_act_btn");
		var chapter = document.getElementById("chapter_btn");

		chapter.className += " selected";
	    recent_act.removeAttribute("selected");
	    recent_act.className=recent_act.className.replace("selected","");

	    var content = get('main-content')
	    var headers = content.querySelectorAll('.chapter_header')
	    var videos = content.querySelectorAll('.video')

	    for (var i = 0; i < headers.length; i++)
	    {
	    	headers[i].innerText = 'Chapter ' + (i + 1)

	    	for (var v = 0; v < videos.length; v++)
	    	{
	    		var vid = videos[v]
	    		var chapter = parseFloat(vid.getAttribute('data-chapter'))
	    		if (chapter.toFixed() == i + 1)
	    		{
	    			var cont = headers[i].nextElementSibling
	    			var added = false
	    			for (var c = 0; c < cont.children.length; c++)
	    			{
	    				var cc = parseFloat(cont.children[c].getAttribute('data-chapter'))
	    				if (chapter < cc)
	    				{
	    					cont.insertBefore(vid, cont.children[c])
	    					added = true
	    					break
	    				}
	    			}

	    			if (!added)
	    			{
	    				cont.appendChild(vid)
	    			}
	    		}
	    	}
	    }
	}

	function sortByActivity(){
		var recent_act = document.getElementById("recent_act_btn");
		var chapter = document.getElementById("chapter_btn");

	    recent_act.className += " selected";
	    chapter.removeAttribute("selected");
	    chapter.className=chapter.className.replace("selected","");

	    var content = get('main-content')
	    var headers = content.querySelectorAll('.chapter_header')
	    var videos = content.querySelectorAll('.video')

	    for (var i = 0; i < headers.length; i++)
	    {
	    	if (i == 0)
	    	{
	    		headers[i].innerText = 'Today'
	    	}
	    	else if (i == 1)
	    	{
	    		headers[i].innerText = 'This Week'
	    	}
	    	else
	    	{
	    		headers[i].innerText = 'Last Week'
	    	}

	    	for (var v = 0; v < videos.length; v++)
	    	{
	    		var vid = videos[v]
	    		var update = parseFloat(vid.getAttribute('data-update'))
	    		if (update.toFixed() == i + 1)
	    		{
	    			var cont = headers[i].nextElementSibling
	    			var added = false
	    			for (var c = 0; c < cont.children.length; c++)
	    			{
	    				var cu = parseFloat(cont.children[c].getAttribute('data-update'))
	    				if (update < cu)
	    				{
	    					cont.insertBefore(vid, cont.children[c])
	    					added = true
	    					break
	    				}
	    			}

	    			if (!added)
	    			{
	    				cont.appendChild(vid)
	    			}
	    		}
	    	}
	    }
	}


	var el = document.getElementById("recent_act_btn");
	el.addEventListener("click", sortByActivity, false);

	var el = document.getElementById("chapter_btn");
	el.addEventListener("click", sortByChapter, false);
})
