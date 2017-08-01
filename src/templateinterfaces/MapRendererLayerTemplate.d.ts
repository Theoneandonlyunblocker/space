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
  // TODO 2017.08.01 | rename defaultAlpha
  alpha?: number; // default 1.0
  destroy?: () => void;
}

export default MapRendererLayerTemplate;
