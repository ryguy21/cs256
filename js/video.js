
addLoadFunction(function()
{
	// ================================================================
	// play and pause functionality
	// ================================================================

	var playInterval = -1
	var video = get('video')
	var playBtn = get('play-pause-btn')
	var playImg = playBtn.querySelector('img')

	function playPause()
	{
		if (playImg.getAttribute('src') == 'img/play.png')
		{
			play()
		}
		else
		{
			pause()
		}
	}

	playBtn.addEventListener('click', playPause)
	document.body.addEventListener('keydown', function(e)
	{
		if (!e.defaultPrevented && e.keyCode == 32) // space
		{
			playPause()

			e.preventDefault()
			e.stopPropagation()
			return false
		}
	})

	function play()
	{
		playImg.setAttribute('src', 'img/pause.png')
		video.play()
		playInterval = setInterval(updateTrack, 50)
	}

	function pause()
	{
		playImg.setAttribute('src', 'img/play.png')
		video.pause()
		clearInterval(playInterval)
	}

	video.addEventListener('ended', pause)

	// ================================================================
	// methods for updating the video time and track slider
	// ================================================================

	function updateTrack()
	{
		var perc = video.currentTime / video.duration
		perc = scale(perc, 0, 1, 1, 99)
		get('video-slider').style.left = perc + '%'
		get('video-time').innerText = printTimestamp(video.currentTime)

		if (updateCommentScroll)
		{
			updateCommentScroll()
		}
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

	// ================================================================
	// method for setting full-screen
	// ================================================================

	get('maximize-btn').addEventListener('click', function()
	{
		if (video.requestFullscreen)
		{
			video.requestFullscreen();
		}
		else if (video.msRequestFullscreen)
		{
			video.msRequestFullscreen();
		}
		else if (video.mozRequestFullScreen)
		{
			video.mozRequestFullScreen();
		}
		else if (video.webkitRequestFullscreen)
		{
			video.webkitRequestFullscreen();
		}
	})

	// ================================================================
	// methods for setting up tags/comments
	// ================================================================

	var tags = [
		{
			tagId: 0,
			text: 'Ask for phone number'
		},
		{
			tagId: 1,
			text: 'Give phone number'
		},
		{
			tagId: 2,
			text: 'Confirm phone number'
		}
	]

	var defaultTags = [
		{
			tagId: 0,
			timestamp: 0
		},
		{
			tagId: 2,
			timestamp: 23
		},
		{
			tagId: 1,
			timestamp: 16.5
		}
	]

	var defaultComments = [
		{
			timestamp: 10,
			userId: 'Rob',
			text: "Why do we have to watch this? It's so staged.",
			isQuestion: true,
			isPrivate: false,
			replies: []
		},
		{
			timestamp: 5,
			userId: 'Tom',
			text: 'This comment is awesome',
			isQuestion: false,
			isPrivate: false,
			replies: [
				{
					userId: 'Rob',
					text: 'This comment is better'
				}
			]
		},
		{
			timestamp: 25,
			userId: 'Tom',
			text: 'When was this video made? 1970?',
			isQuestion: true,
			isPrivate: true,
			replies: [
				{
					userId: 'Josh (TA)',
					text: "1983, actually. I know it's old, but it works."
				}
			]
		},
		{
			timestamp: 5.4,
			userId: 'Jill',
			text: 'WOW this movie is old!',
			isQuestion:false,
			isPrivate:false,
			replies: []
		}
	]

	var flashOnCreate = false

	function addElementToFeed(element, timestamp)
	{
		element.addEventListener('click', function(e)
		{
			var timestamp = parseFloat(e.currentTarget.getAttribute('data-timestamp'))
			video.currentTime = timestamp
			updateTrack()
		})

		if (flashOnCreate)
		{
			element.setAttribute('style', 'background:black;color:white;')
			setTimeout(function(el)
			{
				el.removeAttribute('style')
			}, 0, element)
		}

		var parent = get('comment-feed')
		if (parent.children.length == 0)
		{
			parent.appendChild(element)
			return
		}

		for (var i = 0; i < parent.children.length; i++)
		{
			var child = parent.children[i]
			var childTime = parseFloat(child.getAttribute('data-timestamp'))
			if (childTime > timestamp)
			{
				parent.insertBefore(element, child)
				return
			}
		}

		parent.appendChild(element)
	}

	function addTag(tag)
	{
		// <div class='tag'><span class='username'>Prof. A.</span>This is a tag</div>

		var tagEl = document.createElement('div')
		tagEl.className = 'tag'

		var username = document.createElement('span')
		username.className = 'username'
		username.innerText = 'Tag @ ' + printTimestamp(tag.timestamp)

		tagEl.appendChild(username)
		tagEl.appendChild(document.createTextNode(tags[tag.tagId].text))
		tagEl.setAttribute('data-timestamp', tag.timestamp)

		addElementToFeed(tagEl, tag.timestamp)
	}

	function getCommentClassName(comment)
	{
		var name = 'comment'
		if (comment.isPrivate)
		{
			name += ' private'
		}

		if (comment.isQuestion)
		{
			name += ' question'
		}

		return name
	}

	function addComment(comment)
	{
		// <div class='comment'><span class='username'>Rob</span>This is a comment
		//		<div class='reply'><span class='username'>John</span>This is a reply</div>
		// </div>

		var el = document.createElement('div')
		el.className = getCommentClassName(comment)

		var username = document.createElement('span')
		username.className = 'username'
		username.innerText = comment.userId + ' @ ' + printTimestamp(comment.timestamp)

		el.appendChild(username)
		el.appendChild(document.createTextNode(comment.text))
		el.setAttribute('data-timestamp', comment.timestamp)

		for (var i = 0; i < comment.replies.length; i++)
		{
			var reply = comment.replies[i]

			var replyEl = document.createElement('div')
			replyEl.className = 'reply'

			username = document.createElement('span')
			username.className = 'username'
			username.innerText = reply.userId

			replyEl.appendChild(username)
			replyEl.appendChild(document.createTextNode(reply.text))

			el.appendChild(replyEl)
		}

		addElementToFeed(el, comment.timestamp)
	}

	for (var i = 0; i < defaultTags.length; i++)
	{
		addTag(defaultTags[i])
	}

	for (var i = 0; i < defaultComments.length; i++)
	{
		addComment(defaultComments[i])
	}

	setTimeout(function()
	{
		get('comment-feed').children[0].className += ' focused'
	})

	flashOnCreate = true

	// ================================================================
	// methods for adding comments
	// ================================================================

	function createComment()
	{
		var text = get('comment-text').value
		if (text == '')
		{
			return
		}

		get('comment-text').value = ''

		var comment = {
			timestamp: video.currentTime,
			userId: 'Rob', // create dynamically
			text: text,
			isQuestion: false,
			isPrivate: false,
			replies: []
		}

		defaultComments.push(comment)
		addComment(comment)
	}

	get('send-comment').addEventListener('click', createComment)
	get('comment-text').addEventListener('keydown', stopEvent)
	get('comment-text').addEventListener('keyup', function(e)
	{
		// if they hit enter
		if (e.keyCode == 13)
		{
			createComment()
		}

		stopEvent(e)
		return false
	})

	// ================================================================
	// methods for moving comment feed during video playback
	// ================================================================

	function updateCommentScroll()
	{
		var time = video.currentTime
		var feed = get('comment-feed')
		var comments = feed.children

		var index = -1
		for (var i = 0; i < comments.length; i++)
		{
			var comment = comments[i]
			var timestamp = parseFloat(comment.getAttribute('data-timestamp'))
			if (time >= timestamp && i > index)
			{
				index = i
			}
		}

		for (var i = 0; i < comments.length; i++)
		{
			var comment = comments[i]
			if (i == index)
			{
				if (comment.className.indexOf('focused') < 0)
				{
					comment.className += ' focused'
					animateTo(comment)
				}
			}
			else
			{
				comment.className = comment.className.replace(/focused/gi, '').replace(/  /gi, ' ')
			}
		}
	}

	var intervalId = -1

	function animateTo(comment)
	{
		var feed = get('comment-feed')
		var current = feed.scrollTop
		var target = Math.max(comment.offsetTop - 50, 0)

		if (intervalId >= 0)
		{
			clearInterval(intervalId)
		}

		if (current == target)
		{
			return
		}

		var start = new Date
		intervalId = setInterval(function()
		{
			var dt = (new Date - start) / 1000.0

			if (dt >= 0.5)
			{
				dt = 0.5
				clearInterval(intervalId)
			}

			feed.scrollTop = scale(dt, 0, 0.5, current, target)
		}, 10)
	}
})