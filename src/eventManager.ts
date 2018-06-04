// should be used as little as possible. old code using this should be refactored

/// <reference path="../lib/pixi.d.ts" />

const eventEmitter = new PIXI.utils.EventEmitter();
const eventManager =
{
  dispatchEvent: eventEmitter.emit.bind(eventEmitter),
  removeEventListener: eventEmitter.removeListener.bind(eventEmitter),
  removeAllListeners: eventEmitter.removeAllListeners.bind(eventEmitter),
  addEventListener: <T extends (...args: any[]) => void>(eventType: string, listener: T): T =>
  {
    eventEmitter.on(eventType, listener);

    return listener;
  },
};

export default eventManager;
