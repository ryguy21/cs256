
addLoadFunction(function()
{
	// ================================================================
	// play and pause functionality
	// ================================================================

	get('play-pause-btn').addEventListener('click', function(e)
	{
		var current = e.target.getAttribute('src')
		if (current == 'img/play.png')
		{
			e.target.setAttribute('src', 'img/pause.png')
			play()
		}
		else
		{
			e.target.setAttribute('src', 'img/play.png')
			pause()
		}
	})

	var playTimeout = -1
	var video = get('video')

	function play()
	{
		video.play()
		playTimeout = setInterval(updateTrack, 50)
	}

	function pause()
	{
		video.pause()
		clearInterval(playTimeout)
	}

	// ================================================================
	// methods for updating the video time and track slider
	// ================================================================

	function updateTrack()
	{
		displayVideoTime()
		var perc = video.currentTime / video.duration
		perc = scale(perc, 0, 1, 1, 99)
		get('video-slider').style.left = perc + '%'
	}

	function displayVideoTime()
	{
		var time = Math.floor(video.currentTime)
		var minutes = Math.floor(time / 60)
		var seconds = time - (minutes * 60)

		get('video-time').innerText = pad(minutes, 2) + ':' + pad(seconds, 2)
	}

	get('video-track').addEventListener('click', function(e)
	{
		var perc = e.offsetX / e.target.offsetWidth
		perc = scale(perc, 0, 1, -0.01, 1.01)
		perc = Math.max(Math.min(perc, 1), 0)
		video.currentTime = video.duration * perc
		updateTrack()
	})

	// ================================================================
	// methods for setting video speed
	// ================================================================

	var speeds = get('speed-control').querySelectorAll('.radio-item')
	for (var i = 0; i < speeds.length; i++)
	{
		var speed = speeds[i]
		speed.addEventListener('click', function(e)
		{
			var s = e.target.innerText
			s = s.substring(0, s.length - 1)
			s = parseFloat(s)
			video.playbackRate = s
		})
	}
})