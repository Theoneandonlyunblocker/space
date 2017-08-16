/// <reference path="../../lib/pixi.d.ts" />

import GalaxyMap from "../GalaxyMap";
import Player from "../Player";

declare interface MapRendererLayerTemplate
{
  key: string;
  displayName: string;
  drawingFunction: (map: GalaxyMap, perspectivePlayer?: Player) => PIXI.Container;
  interactive: boolean;
  isUsedForCameraBounds: boolean;
  initialAlpha?: number; // default = 1
  destroy?: () => void;
}

export default MapRendererLayerTemplate;
