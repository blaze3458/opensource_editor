import extend from 'extend';

import Events from './events';
import Editor from './editor';
import Selection from './selection';
import log from './log';


let debug = log('Refuon::');

class Refuon {
	
	constructor(container,__options={}){
		if(!checkContainer(container))
			return debug.error('Null container');
		
		this.options = getOptions(container,__options);
		this.container = this.options.container;
		this.toolbarContainer = this.options.toolbarContainer;
		
		this.container.classList.add('rfo-container');
		this.container.__refuon = this;
		
		this.toolbar = this.setToolbar();
		this.content = this.setEditor();
		
		let editorOptions = {
				counter : this.options.counter,
				charCounterMax : this.options.charCounterMax,
				height : this.options.height,
				heightMax : this.options.heightMax,
				heightMin : this.options.heightMin
			};
		
		this.events = new Events();
		this.editor = new Editor(this.content,editorOptions,this.events);
		this.selection = new Selection(this.editor,this.events);
		
		this.events.listenDOM('input',this.content,()=>{
			
			if(this.options.charCounterMax > 0 && this.editor.getLength() > this.options.charCounterMax){
				return;
			}
			console.log('input');
			console.log(event);
			this.update();
		});
		
		this.events.on(Events.eventlist.EDITOR_CHANGE, (type,evnt) => {
			if (type === Events.eventlist.TEXT_CHANGE) {
				this.content.children[0].children[0].classList.toggle('editor-blank', this.editor.isBlank());
			}
		});
		
		this.editor.setDefault();
		
		if(this.options.onFocus)
			this.focus();
		
		console.log(this);
		console.log(this.toolbar);
		console.log(this.content);
	}
	
	static registerModule(path,target, overwrite = false){
		if (typeof path !== 'string') {
			let name = path.attrName || path.blotName;
			if (typeof name === 'string') {
				this.registerModule('formats/' + name, path, target);
			} 
			else {
				Object.keys(path).forEach((key) => {
					this.registerModule(key, path[key], target);
				});
			}
		} 
		else
		{
			this.imports[path] = target;
			
		}
	}
	
	setToolbar(){
		let toolbar = this.addContainerToToolbar('refuon-toolbar');
		
		let toolbarWidth = this.options.modules.toolbarOptions.width;
		
		if(typeof toolbarWidth === "number" && toolbarWidth > 0)
			toolbar.style.width = toolbarWidth + "px";
		
		let toolbarInner = this.addElement(toolbar,'tl');
		let buttonInner = this.addElement(toolbarInner,'b-tl');
		
		let buttons = this.options.modules.toolbar;
		
		buttons.forEach(function(separator){
			var newSeparator = document.createElement('div');
			newSeparator.classList.add('tl-separator');
			separator.forEach(function(button){
				let newButton = document.createElement('button');
				newButton.classList.add('tl-buttons');
				newButton.classList.add('icon-'+button);
				newSeparator.insertBefore(newButton,null);
			});
			buttonInner.insertBefore(newSeparator,null);
		});
		return toolbar;
	}
	
	setEditor(){
		let editor = this.addContainer('ed-cont');
		
		if(this.options.documentReady)
			editor.classList.add('ed-docready');
		
		let editorInner = this.addElement(editor,'ed-in');
		let content = this.addElement(editorInner,'editor');
		
		if(this.options.counter || this.options.charCounterMax > 0)
			var editorCounter = this.addElement(editorInner,'editor-counter');
		
		
		let placeholder = this.options.placeholder;
		content.classList.add('editor-blank');
		content.setAttribute('contenteditable','true');
		content.setAttribute('data-placeholder',placeholder);
		
		if(this.options.height > 0){
			content.style.height = this.options.height+"px";
			content.style.overflow = 'auto';
		}
		else{
			
			if(this.options.heightMax > 0){
				content.style.maxHeight = this.options.heightMax+"px";
				content.style.overflow = 'auto';
			}
		
			if(this.options.heightMin > 0){
				content.style.minHeight = this.options.heightMin+"px";
				content.style.overflow = 'auto';
			}
		}
		
		return editor;
	}
	
	addContainer(container, refNode = null) {
		if (typeof container === 'string') {
			let className = container;
			container = document.createElement('div');
			container.classList.add(className);
		}
		this.container.insertBefore(container, refNode);
		return container;
	}
	
	addContainerToToolbar(container, refNode = null) {
		if (typeof container === 'string') {
			let className = container;
			container = document.createElement('div');
			container.classList.add(className);
		}
		this.toolbarContainer.insertBefore(container, refNode);
		return container;
	}
	
	addElement(elm,container, refNode = null) {
		if (typeof container === 'string') {
			let className = container;
			container = document.createElement('div');
			container.classList.add(className);
		}
		let newElm = elm.insertBefore(container, refNode);
		return newElm;
	}
	
	update(){
		if(this.options.counter || this.options.charCounterMax > 0)
			this.editor.updateCounter();
		
		let args = [Events.eventlist.TEXT_CHANGE];
		this.events.emit(Events.eventlist.EDITOR_CHANGE,...args);
	}
	
	blur(){
		this.editor.blur();
	}
	
	focus(){
		this.editor.focus();
	}
	
	clear(){
		this.editor.clear();
		this.update();
	}
}

function checkContainer(container){
	
	let result_cont = document.querySelectorAll(container);
	
	if(result_cont.length === 0|| container === null || container === undefined)
		return false;
	
	return true;
}

function getOptions(container,options){
	
	options = extend(true,{container},Refuon.DEFAULT_OPTIONS,options);
	
	let toolbar = options.modules.toolbar;
	let customButtons = options.modules.customButtons;
	if(toolbar.length !== 0){
		let checkedtoolbar = [];
		let duplicateChecker = [];
		toolbar.forEach(function(separator){
			let checkedSeparator = [];
			separator.forEach(function(button){
				if(!Refuon.DEFAULT_BUTTONS.includes(button)){
					debug.warn(`Invalid default button ${button}.`);
				}
				else{
					if(button === 'fontsize' && options.modules.fontsize.length === 0){
						let defaultfontsizes = {modules:{fontsize:Refuon.READY_OPTIONS.modules.fontsize}};
						options = extend(true,{},defaultfontsizes,options);
					}
					
					if(button === 'fonttype' && options.modules.fonttype.length === 0){
						let defaultfonttypes = {modules:{fonttype:Refuon.READY_OPTIONS.modules.fonttype}};
						options = extend(true,{},defaultfonttypes,options);
					}
					if(button === 'colorpicker' && options.modules.colorpicker.background.length === 0){
						let defaultcolorpicker = {modules:{colorpicker:Refuon.READY_OPTIONS.modules.colorpicker}};
						options = extend(true,{},defaultcolorpicker,options);
					}
					
					if(duplicateChecker.includes(button))
						debug.warn(`Duplicate button ${button}.`);
					else{
						duplicateChecker.push(button);
						checkedSeparator.push(button);
					}
				}
			});
			checkedtoolbar.push(checkedSeparator);
		});
		options.modules.toolbar = checkedtoolbar
	}
	else{
		let newModules = {modules:{toolbar:Refuon.READY_OPTIONS.modules.toolbar}};
		options = extend(true,{},newModules,options);
	}
	
	['toolbarContainer','container'].forEach(function(key){
		if(typeof options[key] === 'string'){
			if(options[key].length === 0)
				options[key] = document.querySelector(options['container']);
			else
				options[key] = document.querySelector(options[key]);
		}
	});
	
	
	console.log(options);
	return options;
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

Refuon.DEFAULT_BUTTONS = [
	'bold','italic','underline','strikethrough','undo','redo','subscript','superscript','emoticon',
	'link','image','printer','quote','code','colorpicker','fonttype','fontsize','leftindent','rightindent',
	'unorderedlist','orderedlist','align','fullscreen'
]

Refuon.DEFAULT_OPTIONS = {
	placeholder : '',
	toolbarContainer:'',
	height:0,
	heightMax:0,
	heightMin:0,
	counter:false,
	charCounterMax:0,
	documentReady:false,
	onFocus:false,
	modules:{
		toolbar:[],
		toolbarOptions:{
			sticky:false,
			position:'top',
			tooltip:false,
		},
		fontsize:[],
		fonttype:[],
		customButtons:[],
		colorpicker:{background:[],font:[]}
	},
};

Refuon.READY_OPTIONS = {
	placeholder:'Message',
	toolbarContainer:'',
	height:0,
	heightMax:0,
	heightMin:0,
	counter:false,
	charCounterMax:0,
	documentReady:false,
	onFocus:false,
	modules:{
		toolbar:[
			['bold','italic','underline','strikethrough'],
			['fontsize','fonttype'],
			['undo','redo']
		],
		toolbarOptions:{
			sticky:false,
			position:'top',
			tooltip:false,
		},
		fontsize:[8,9,10,11,12,14,16,18,20,25,30,36],
		fonttype:['Arial','Times New Roman','Comic Sans MS','Verdana','Tahoma','Calibri'],
		colorpicker:{background:['#ffffff','#000000'],font:['#ffffff','#000000']}
	},
}

Refuon.imports = {}

export default Refuon;