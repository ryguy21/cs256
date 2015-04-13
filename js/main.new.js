// i know a lot of this code is messy and redundant, but it works
addLoadFunction(function()
{
	function sortByChapter(){
		var recent_act = document.getElementById("recent_act_btn");
		var chapter = document.getElementById("chapter_btn");
		
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



	function fadeOutVideos() {
		// video container
		var videosCont = document.getElementsByClassName("videos_cont");
		for(var i = 0, ii = videosCont.length; i < ii ; i++ ) videosCont[i].classList.add("fadeVideos");
		// chpater headers
		var chapterHeaders = document.getElementsByClassName("chapter_header");
		for(var i = 0, ii = chapterHeaders.length; i < ii ; i++ ) chapterHeaders[i].classList.add("fadeVideos");
		// selected btn
		var sort_by_btn = document.getElementsByClassName("sort_by_btn");
		for(var i = 0, ii = sort_by_btn.length; i < ii ; i++ ) sort_by_btn[i].classList.add("fadeVideos");
	}

	function fadeInVideos() {
		// video container
		var videosCont = document.getElementsByClassName("videos_cont");
		for(var i = 0, ii = videosCont.length; i < ii ; i++ ) videosCont[i].classList.remove("fadeVideos");
		// chapter header
		var chapterHeaders = document.getElementsByClassName("chapter_header");
		for(var i = 0, ii = chapterHeaders.length; i < ii ; i++ ) chapterHeaders[i].classList.remove("fadeVideos");
		// selected btn
		var sort_by_btn = document.getElementsByClassName("sort_by_btn");
		for(var i = 0, ii = sort_by_btn.length; i < ii ; i++ ) sort_by_btn[i].classList.remove("fadeVideos");
	} 

	function fadeController(evt){
		var recent_act_btn = document.getElementById("recent_act_btn");
		var chapter_btn = document.getElementById("chapter_btn");
		//fade out content
		fadeOutVideos();
		setTimeout(function(){
			if (evt.target == chapter_btn) { 
				chapter_btn.classList.add("selected"); 
				sortByChapter() 
				recent_act_btn.classList.remove("selected");
			} else{
				recent_act_btn.classList.add("selected");
				sortByActivity();
				chapter_btn.classList.remove("selected"); 
			}
			fadeInVideos();
		},300);
	}

	var el = document.getElementById("recent_act_btn");
	el.addEventListener("click", fadeController);

	var el = document.getElementById("chapter_btn");
	el.addEventListener("click", fadeController);

})