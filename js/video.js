
var video = document.getElementById("video1"); 

// uses the video-track we created to control the timestamp of the video
// the way that it is now, it needs an onclick attribute in the html

function changeTime(event) {
  var video_track = document.getElementById("video-track");

  var percent = event.clientX / video_track.clientWidth; // percent
  var newDuration = percent * video.duration;
  video.currentTime = newDuration;
}