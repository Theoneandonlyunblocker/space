/// <reference path="../lib/pixi.d.ts" />

import Background from "./Background";

declare interface BackgroundDrawingFunction
{
  (seed: string, size: PIXI.Rectangle, renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer): Background;
}

export default BackgroundDrawingFunction;
