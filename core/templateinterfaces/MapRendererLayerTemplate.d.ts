import * as PIXI from "pixi.js";

import {GalaxyMap} from "../map/GalaxyMap";
import {Player} from "../player/Player";

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
