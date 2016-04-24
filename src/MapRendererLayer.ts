/// <reference path="../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "./templateinterfaces/MapRendererLayerTemplate";

import GalaxyMap from "./GalaxyMap";
import MapRenderer from "./MapRenderer";

export default class MapRendererLayer
{
  public template: MapRendererLayerTemplate;
  public container: PIXI.Container;
  public isDirty: boolean = true;
  public get alpha(): number
  {
    return this._alpha;
  }
  public set alpha(newAlpha: number)
  {
    this._alpha = newAlpha;
    this.container.alpha = newAlpha;
  }
  
  private _alpha: number;
  
  constructor(template: MapRendererLayerTemplate)
  {
    this.template = template;
    this.container = new PIXI.Container();
    this.container.interactiveChildren = template.interactive;
    this.alpha = template.alpha || 1;
  }
  
  public resetAlpha()
  {
    this.alpha = this.template.alpha || 1;
  }
  public draw(map: GalaxyMap, mapRenderer: MapRenderer)
  {
    if (!this.isDirty) return;
    this.container.removeChildren();
    this.container.addChild(this.template.drawingFunction.call(mapRenderer, map));
    this.isDirty = false;
  }
  public destroy()
  {
    if (this.template.destroy)
    {
      this.template.destroy();
    }
  }
}
