import * as PIXI from "pixi.js";


interface Background
{
  displayObject: PIXI.DisplayObject;
  destroy: () => void;
}

export type BackgroundDrawingFunction = (
  seed: string,
  size: PIXI.Rectangle,
  renderer: PIXI.Renderer,
) => Background;
