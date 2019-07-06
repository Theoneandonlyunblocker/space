import * as PIXI from "pixi.js";

import {GalaxyMap} from "../GalaxyMap";
import {Player} from "../Player";

export interface MapRendererLayerTemplate
{
  key: string;
  displayName: string;
  drawingFunction: (map: GalaxyMap, perspectivePlayer?: Player) => PIXI.Container;
  interactive: boolean;
  isUsedForCameraBounds: boolean;
  initialAlpha?: number; // default = 1
  destroy?: () => void;
}
