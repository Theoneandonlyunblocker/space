/// <reference path="../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "./templateinterfaces/MapRendererLayerTemplate.d.ts";

import GalaxyMap from "./GalaxyMap.ts";
import MapRenderer from "./MapRenderer.ts";

export default class MapRendererLayer
{
  template: MapRendererLayerTemplate;
  container: PIXI.Container;
  isDirty: boolean = true;
  private _alpha: number;
  get alpha(): number
  {
    return this._alpha;
  }
  set alpha(newAlpha: number)
  {
    this._alpha = newAlpha;
    this.container.alpha = newAlpha;
  }
  constructor(template: MapRendererLayerTemplate)
  {
    this.template = template;
    this.container = new PIXI.Container();
    this.container.interactiveChildren = template.interactive;
    this.alpha = template.alpha || 1;
  }
  resetAlpha()
  {
    this.alpha = this.template.alpha || 1;
  }
  draw(map: GalaxyMap, mapRenderer: MapRenderer)
  {
    if (!this.isDirty) return;
    this.container.removeChildren();
    this.container.addChild(this.template.drawingFunction.call(mapRenderer, map));
    this.isDirty = false;
  }
}
