import log from './log';
import extend from 'extend';


let debug = log('Refuon::');

class Refuon {
	
	constructor(container,__options={}){
		if(!checkContainer(container))
			return debug.error('Null container');
		
		this.options = getOptions(container,__options);
		this.container = this.options.container;
		this.toolbarContainer = this.options.toolbarContainer;
		
		this.setToolbar();
		
	}
	
	registerModule(path,target){
		
	}
	
	setToolbar(){
		this.toolbarContainer.classList.add('refuon-toolbar');
		this.toolbarContainer.innerHTML = '';
		this.toolbar = this.addContainerToToolbar('tl');
		let toolbarInner = this.addToolbarElement(this.toolbar,'b-tl');
		
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
			toolbarInner.insertBefore(newSeparator,null);
		});
		
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
	
	addToolbarElement(elm,container, refNode = null) {
		if (typeof container === 'string') {
			let className = container;
			container = document.createElement('div');
			container.classList.add(className);
		}
		let newElm = elm.insertBefore(container, refNode);
		return newElm;
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
					
					checkedSeparator.push(button);
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
		if(options[key] === null)
			options[key] = document.querySelector(options['container']);
		else
			options[key] = document.querySelector(options[key]);
	});
	
	
	console.log(options);
	return options;
}

Refuon.DEFAULT_BUTTONS = [
	'bold','italic','underline','strike','undo','redo','subscript','superscript','emoji',
	'link','image','printer','quote','code','colorpicker','fonttype','fontsize','leftindent','rightindent',
	'unorderedlist','orderedlist','align','fullscreen'
]

Refuon.DEFAULT_OPTIONS = {
	placeholder : '',
	toolbarContainer:null,
	modules:{
		toolbar:[],
		toolbarOptions:{
			sticky:false,
			position:'top',
			tooltip:false
		},
		fontsize:[],
		fonttype:[],
		customButtons:[],
		colorpicker:{background:[],font:[]}
	},
};

Refuon.READY_OPTIONS = {
	placeholder:'Message',
	toolbarContainer:null,
	modules:{
		toolbar:[
			['bold','italic','underline','strike'],
			['fontsize','fonttype'],
			['undo','redo']
		],
		toolbar_options:{
			sticky:false,
			position:'top',
			tooltip:false
		},
		fontsize:[8,9,10,11,12,14,16,18,20,25,30,36],
		fonttype:['Arial','Times New Roman','Comic Sans MS','Verdana','Tahoma','Calibri'],
		colorpicker:{background:['#ffffff','#000000'],font:['#ffffff','#000000']}
	},
}

export {Refuon};