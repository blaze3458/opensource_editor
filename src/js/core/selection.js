import log from './log';
import Events from './events';

let debug = log('Refuon::selection');


class Selection{
	constructor(editor,events){
		this.editor = editor;
		this.events = events;
		
		this.contentContainer = this.editor.getContainer();
		
		this.mouseDown = false;
		
		this.handleMouseEvent();
		this.events.listenDOM('selectionchange',document, ()=> {
			console.log('selectionchange');
			console.log(event);
			if(!this.mouseDown){
				//setTimeout(this.update.bind(this, Emitter.sources.USER), 1);
			}
		});
	}
	
	handleMouseEvent(){
		this.events.listenDOM('mousedown', document.body, () => {
			console.log('mousedown');
			console.log(event);
			this.mouseDown = true;
		});
		
		this.events.listenDOM('mouseup', document.body, () => {
			console.log('mouseup');
			console.log(event);
			this.mouseDown = false;
			//this.update(Emitter.sources.USER);
		});
	}
}

export default Selection;