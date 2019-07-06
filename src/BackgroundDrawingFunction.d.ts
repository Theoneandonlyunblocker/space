import * as PIXI from "pixi.js";

import {Background} from "./Background";

export type BackgroundDrawingFunction = (
  seed: string,
  size: PIXI.Rectangle,
  renderer: PIXI.Renderer,
) => Background;
