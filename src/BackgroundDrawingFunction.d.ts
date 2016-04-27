/// <reference path="../lib/pixi.d.ts" />

interface BackgroundDrawingFunction
{
  (seed: string, size: PIXI.Rectangle, renderer: PIXI.SystemRenderer): PIXI.DisplayObject;
}

export default BackgroundDrawingFunction;
