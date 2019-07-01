import * as PIXI from "pixi.js";

import Background from "./Background";

declare type BackgroundDrawingFunction = (
  seed: string,
  size: PIXI.Rectangle,
  renderer: PIXI.Renderer,
) => Background;

export default BackgroundDrawingFunction;
