import extend from 'extend';

import log from './log';
import Events from './events';

let debug = log('Refuon::editor');

class Editor {
	constructor(container,options,events){
		this.container = container;
		this.options = options;
		this.events = events;
		
		this.editableContent = this.container.children[0].children[0];
		
		
		if(this.options.counter || this.options.charCounterMax > 0){
		
			if(this.options.charCounterMax > 0){
			
				this.events.listenDOM('keypress',this.container,()=>{
					if(this.getLength() > this.options.charCounterMax)
						event.preventDefault();
				});
			}
		
			this.counter = this.container.children[0].children[1];
			this.updateCounter();
		}
	}

	isBlank(){
		
		if(this.getHTMLLength() === 0) this.setDefault();
		if(this.getLength() === 0) return true;
		if(this.getTextLength() === 0) return true;
		
		return false;
	}

	getLength(){
		return this.editableContent.textContent.length;
	}
	
	getTextLength(){
		return this.editableContent.innerText.length;
	}
	
	getHTMLLength(){
		return this.editableContent.innerHTML.length;
	}

	getContainer(){
		return this.container;
	}

	setDefault(){
		this.editableContent.innerHTML = '<p><br/></p>';
	}

	blur(){
		let selection = document.getSelection();
		
		this.editableContent.blur();
		document.body.focus();
		
		if(selection !== null)
			selection.removeAllRanges();
	}

	focus(){
		this.editableContent.focus();
	}

	updateCounter(){
		if(!this.options.counter && this.options.charCounterMax <= 0){
			return debug.error('Invalid update counter');
		}
		
		let length = this.getLength();

		if(this.options.charCounterMax > 0){
			let maxLength = this.options.charCounterMax;
		
			this.counter.innerText = length + "/"+maxLength;
		}
		else{
			this.counter.innerText = length;
		}
	}

	clear(){
		this.editableContent.innerText = "";
		this.setDefault();
	}
}

export default Editor;