/// <reference path="../lib/pixi.d.ts" />

declare class EventEmitter3 extends PIXI.EventEmitter
{
  
}

module Rance
{
  export var eventEmitter = new EventEmitter3();
  export var eventManager =
  {
    dispatchEvent: eventEmitter.emit.bind(eventEmitter),
    removeEventListener: eventEmitter.removeListener.bind(eventEmitter),
    removeAllListeners: eventEmitter.removeAllListeners.bind(eventEmitter),
    addEventListener: function(eventType: string, listener: Function)
    {
      eventEmitter.on(eventType, listener);
      return listener;
    }
  };
}
