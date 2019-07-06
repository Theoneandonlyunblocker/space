import * as PIXI from "pixi.js";

export interface Background
{
  displayObject: PIXI.DisplayObject;
  destroy: () => void;
}
