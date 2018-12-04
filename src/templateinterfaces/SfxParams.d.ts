import * as PIXI from "pixi.js";

import Point from "../Point";
import Unit from "../Unit";

declare interface SfxParams
{
  user: Unit;
  target?: Unit;
  userOffset: Point;
  targetOffset?: Point;
  width: number;
  height: number;
  duration: number; // in milliseconds
  facingRight: boolean;
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  triggerStart: (displayObject: PIXI.DisplayObject) => void;
  triggerEffect: () => void;
  triggerEnd: () => void;
}

export default SfxParams;
