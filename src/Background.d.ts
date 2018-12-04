import * as PIXI from "pixi.js";

declare interface Background
{
  displayObject: PIXI.DisplayObject;
  destroy: () => void;
}

export default Background;
