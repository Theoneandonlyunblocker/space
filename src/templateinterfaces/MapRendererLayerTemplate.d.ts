/// <reference path="../../lib/pixi.d.ts" />

import GalaxyMap from "../GalaxyMap";

declare interface MapRendererLayerTemplate
{
  key: string;
  displayName: string;
  drawingFunction: (map: GalaxyMap) => PIXI.Container;
  interactive: boolean;
  alpha?: number; // default 1.0
  destroy?: () => void;
}

export default MapRendererLayerTemplate;
