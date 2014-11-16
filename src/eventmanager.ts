/// <reference path="../lib/pixi.d.ts" />

module Rance
{
  export function EventManager()
  {

  };

  var et: any = PIXI.EventTarget;

  et.mixin(EventManager.prototype);

  export var eventManager = new EventManager();
}
