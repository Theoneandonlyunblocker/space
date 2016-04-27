/// <reference path="../lib/pixi.d.ts" />

declare interface Background
{
  displayObject: PIXI.DisplayObject;
  destroy: () => void;
}

export default  Background;
