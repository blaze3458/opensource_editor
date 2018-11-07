import {Refuon} from '../main.js';

/*document.getElementsByClassName("editor")[0].addEventListener("input", function(event) {
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
*/

var edit = new Refuon("#test",{
	heightMin:100,
	heightMax:300,
	height:400,
	counter:true,
	charCounterMax:5,
	documentReady:true,
	onFocus:true,
	toolbarContainer:'#toolbar_test',
	modules:{
		toolbar:[
			['undo','redo'],
			['bold',,'italic','underline','strikethrough'],
			['colorpicker','fonttype','fontsize'],
			['emoticon']
		],
		toolbarOptions:{
			showSelection:true,
			position:'bottom',
			tooltip:true
		},
		fontsize:[0,1,2,3,4,5,6],
		fonttype:['Arial']
	},
	placeholder:"Write Something..."
	
});

document.getElementById("external").addEventListener("click",function(){
	edit.clear();
});