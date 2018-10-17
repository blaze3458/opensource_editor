document.getElementsByClassName("editor")[0].addEventListener("input", function(event) {
    console.log(event);
	if(event.target.innerHTML.length === 0){
		event.target.innerHTML = "<p><br></p>";
	}
}, false);

document.getElementsByClassName("icon-undo")[0].addEventListener("click", function(event){
	console.log(event);
	document.execCommand("undo",false,null);
},false);

document.getElementsByClassName("icon-redo")[0].addEventListener("click", function(event){
	console.log(event);
	document.execCommand("redo",false,null);
},false);

document.getElementsByClassName("icon-bold")[0].addEventListener("click", function(event){
	console.log(event);
	document.execCommand("bold",true,null);
},false);
