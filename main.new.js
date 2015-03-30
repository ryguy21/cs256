// i know a lot of this code is messy and redundant, but it works

function sortByChapter(){
	//alert(event);
	var recent_act = document.getElementById("recent_act_btn");
	var chapter = document.getElementById("chapter_btn");

	chapter.className += " selected";
    recent_act.removeAttribute("selected");
    recent_act.className=recent_act.className.replace("selected","");
}

function sortByActivity(){
	var recent_act = document.getElementById("recent_act_btn");
	var chapter = document.getElementById("chapter_btn");
	//if(recent_act.classList.contains("selected")) {
    recent_act.className += " selected";
    chapter.removeAttribute("selected");
    chapter.className=chapter.className.replace("selected","");
//}
}


var el = document.getElementById("recent_act_btn");
el.addEventListener("click", sortByActivity, false);

var el = document.getElementById("chapter_btn");
el.addEventListener("click", sortByChapter, false);
