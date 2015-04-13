
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

var videoData = {
	videoId: 0,
	url: '',
	tags: [
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
	],
	comments: [
		{
			timestamp: 10,
			userId: 'Rob',
			text: "Why do we have to watch this? It's so staged.",
			isQuestion: true,
			isPrivate: false,
			isAnonymous: false,
			responses: []
		},
		{
			timestamp: 5,
			userId: 'Kaitlynn',
			text: 'This comment is awesome',
			isQuestion: false,
			isPrivate: false,
			isAnonymous: false,
			responses: [
				{
					userId: 'Rob',
					text: 'This comment is better',
					isAnonymous: true
				}
			]
		},
		{
			timestamp: 25,
			userId: 'Tom',
			text: 'When was this video made? 1970?',
			isQuestion: true,
			isPrivate: true,
			responses: [
				{
					userId: 'Josh (TA)',
					text: "1983, actually. I know it's old, but it works.",
					isAnonymous: false
				}
			]
		},
		{
			timestamp: 7,
			userId: 'Tom',
			text: 'WOW this movie is old!',
			isQuestion:false,
			isPrivate:true,
			responses: []
		}
	],
	subtitles: [
		{
			timestamp: 0,
			duration: 2.5,
			text: "Woman: Can I get your phone number?"
		},
		{
			timestamp: 2.5,
			duration: 1.85,
			text: "Man: Sure, uh..."
		},
		{
			timestamp: 4.35,
			duration:2.35,
			text: 'Do you have something to write it on?'
		},
		{
			timestamp: 6.7,
			duration:1.3,
			text: 'Woman: Yes, let me pull it out'
		},
		{
			timestamp: 8,
			duration:1.5,
			text: "Hang on.|Man: Okay"
		},
		{
			timestamp: 17,
			duration: 2,
			text: "Man: 123"
		},
		{
			timestamp: 19,
			duration: 2,
			text: "456"
		},
		{
			timestamp: 21,
			duration: 1.5,
			text: "7890"
		},
		{
			timestamp: 23.2,
			duration: 3.8,
			text: "Woman: That's 123 456 7890. Right?"
		},
		{
			timestamp: 27,
			duration: 1,
			text: "Man: That's correct"
		}
	]
}

addLoadFunction(function()
{
	get('search_bar').addEventListener('keydown', stopEvent)

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

		if (updateSubtitles)
		{
			updateSubtitles()
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
	// methods for displaying subtitles
	// ================================================================

	get('subtitles-on').addEventListener('click', updateSubtitles)
	get('subtitles-off').addEventListener('click', updateSubtitles)

	function updateSubtitles()
	{
		if (get('subtitles-on').className.indexOf('selected') < 0)
		{
			get('video-subtitles').removeAttribute('class')
			return
		}

		var time = video.currentTime
		for (var s = 0; s < videoData.subtitles.length; s++)
		{
			var subtitle = videoData.subtitles[s]
			if (time >= subtitle.timestamp && time < subtitle.timestamp + subtitle.duration)
			{
				get('video-subtitles').className = 'show'

				if (subtitle.text.indexOf('|') < 0)
				{
					get('subtitle').innerText = subtitle.text
				}
				else
				{
					var items = subtitle.text.split('|')
					el = get('subtitle')
					el.innerHTML = ''
					el.appendChild(document.createTextNode(items[0]))
					for (var i = 1; i < items.length; i++)
					{
						el.appendChild(document.createElement('br'))
						el.appendChild(document.createTextNode(items[i]))
					}
				}

				return
			}
		}

		get('video-subtitles').removeAttribute('class')
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
		createCommentFunctionality(el, comment)

		var username = document.createElement('span')
		username.className = 'username'
		var displayName = comment.isAnonymous ? 'Anonymous' : comment.userId
		username.appendChild(document.createTextNode(displayName))
		if (comment.isQuestion)
		{
			username.appendChild(document.createTextNode(' asked'))
		}

		if (comment.isPrivate)
		{
			var pel = document.createElement('span')
			pel.className = 'private'
			pel.innerText = ' (private)'
			username.appendChild(pel)
		}

		username.appendChild(document.createTextNode(' @ ' + printTimestamp(comment.timestamp)))

		el.appendChild(username)
		el.appendChild(document.createTextNode(comment.text))
		el.setAttribute('data-timestamp', comment.timestamp)

		for (var i = 0; i < comment.responses.length; i++)
		{
			createCommentReply(el, comment, i)
		}

		addElementToFeed(el, comment.timestamp)
	}

	function createCommentReply(el, comment, index)
	{
		var reply = comment.responses[index]

		var replyEl = document.createElement('div')
		replyEl.className = 'reply'

		var username = document.createElement('span')
		username.className = 'username'
		username.innerText = reply.isAnonymous ? 'Anonymous' : reply.userId

		replyEl.appendChild(username)
		replyEl.appendChild(document.createTextNode(reply.text))

		el.appendChild(replyEl)
		return replyEl
	}

	function createCommentFunctionality(el, comment)
	{
		el.setAttribute('data-user', comment.userId)

		var replyEl = document.createElement('div')
		replyEl.className = 'button'
		replyEl.innerText = 'Reply'
		replyEl.addEventListener('click', function(e)
		{
			var el = e.target.parentNode

			if (el.getAttribute('replying'))
			{
				return
			}
			el.setAttribute('replying', true)
			e.target.setAttribute('style', 'display:none')

			var user = el.getAttribute('data-user')
			var timestamp = parseFloat(el.getAttribute('data-timestamp'))

			var comment = null
			for (var c = 0; c < videoData.comments.length; c++)
			{
				comment = videoData.comments[c]
				if (comment.userId == user && comment.timestamp == timestamp)
				{
					break
				}
			}

			if (comment == null)
			{
				return
			}

			var reply = {
				userId: 'Tom',
				text: '',
				isAnonymous: false
			}

			var index = comment.responses.length
			comment.responses.push(reply)

			var replyEl = createCommentReply(el, comment, index)

			var replyText = document.createElement('input')
			replyText.setAttribute('placeholder', 'Type reply')
			replyText.addEventListener('keydown', stopEvent)

			function sendReply(e)
			{
				e.stopPropagation()
				var parent = e.target.parentNode
				var text = null
				for (var c = 1; c < parent.children.length; c++)
				{
					var child = parent.children[c]
					if (child.nodeName.toLowerCase() == 'input')
					{
						text = child.value
					}
				}

				if (text == null || text.trim().length == 0)
				{
					return
				}

				parent.removeChild(parent.children[1]) // remove button
				parent.removeChild(parent.children[1]) // remove text input
				parent.appendChild(document.createTextNode(text.trim()))

				var el = parent.parentNode
				el.children[0].removeAttribute('style')
				el.removeAttribute('replying')
				var user = el.getAttribute('data-user')
				var timestamp = parseFloat(el.getAttribute('data-timestamp'))

				var comment = null
				for (var c = 0; c < videoData.comments.length; c++)
				{
					comment = videoData.comments[c]
					if (comment.userId == user && comment.timestamp == timestamp)
					{
						break
					}
				}

				if (comment == null)
				{
					return
				}

				comment.responses[comment.responses.length - 1].text = text.trim()
				console.log(videoData.comments)
			}

			replyText.addEventListener('keyup', function(e)
			{
				e.stopPropagation()

				if (e.keyCode == 13)
				{
					sendReply(e)
				}
			})

			var replyBtn = document.createElement('div')
			replyBtn.className = 'button'
			replyBtn.innerText = 'Post'
			replyBtn.addEventListener('click', sendReply)

			replyEl.appendChild(replyBtn)
			replyEl.appendChild(replyText)
			replyText.focus()
		})

		el.appendChild(replyEl)

		if (comment.userId == 'Tom')
		{
			var delEl = document.createElement('div')
			delEl.className = 'button'
			delEl.innerText = 'Delete'
			delEl.addEventListener('click', function(e)
			{
				e.stopPropagation()

				var el = e.target.parentNode
				var list = get('comment-feed')
				list.removeChild(el)

				var user = el.getAttribute('data-user')
				var timestamp = parseFloat(el.getAttribute('data-timestamp'))
				for (var c = 0; c < videoData.comments.length; c++)
				{
					comment = videoData.comments[c]
					if (comment.userId == user && comment.timestamp == timestamp)
					{
						videoData.comments.splice(c, 1)
					}
				}
			})

			el.appendChild(delEl)
		}
	}

	for (var i = 0; i < videoData.tags.length; i++)
	{
		addTag(videoData.tags[i])
	}

	for (var i = 0; i < videoData.comments.length; i++)
	{
		addComment(videoData.comments[i])
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
		var optionsBtn = get('comment-option-btn')
		optionsBtn.className = optionsBtn.className.replace(' show', '')

		var comment = {
			timestamp: video.currentTime,
			userId: 'Tom', // create dynamically
			text: text,
			isQuestion: get('comment-question').checked,
			isPrivate: get('comment-private').checked,
			isAnonymous: get('comment-anon').checked,
			responses: []
		}

		videoData.comments.push(comment)
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

			if (dt >= 0.51)
			{
				dt = 0.51
				clearInterval(intervalId)
			}

			feed.scrollTop = scale(dt, 0, 0.51, current, target)
		}, 10)
	}

	get('comment-option-btn').addEventListener('click', function()
	{
		var optionsBtn = get('comment-option-btn')
		if (optionsBtn.className.indexOf('show') < 0)
		{
			optionsBtn.className += ' show'
		}
		else
		{
			optionsBtn.className = optionsBtn.className.replace(' show', '')
		}
	})
})