import EventEmitter from 'eventemitter3';
import log from './log';

let debug = log('Refuon::events');


const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

EVENTS.forEach(function(eventName) {
  document.addEventListener(eventName, (...args) => {
    [].slice.call(document.querySelectorAll('.rfo-container')).forEach((node) => {
      // TODO use WeakMap
      if (node.__refuon && node.__refuon.events) {
        node.__refuon.events.handleDOM(...args);
      }
    });
  });
});

class Events extends EventEmitter {
	
	constructor(){
		super();
		this.listeners = {};
		this.on('error', debug.error);
	}
	
	emit() {
    debug.log.apply(debug, arguments);
    super.emit.apply(this, arguments);
  }

  handleDOM(event, ...args) {
    (this.listeners[event.type] || []).forEach(function({ node, handler }) {
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }

  listenDOM(eventName, node, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push({ node, handler })
  }
}

Events.eventlist = {
  EDITOR_CHANGE        : 'editor-change',
  SCROLL_BEFORE_UPDATE : 'scroll-before-update',
  SCROLL_OPTIMIZE      : 'scroll-optimize',
  SCROLL_UPDATE        : 'scroll-update',
  SELECTION_CHANGE     : 'selection-change',
  TEXT_CHANGE          : 'text-change'
};

export default Events;
