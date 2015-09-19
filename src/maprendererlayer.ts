/// <reference path="../lib/pixi.d.ts" />
/// <reference path="galaxymap.ts" />
/// <reference path="templateinterfaces/imaprendererlayertemplate.d.ts" />

module Rance
{
  export class MapRendererLayer
  {
    template: IMapRendererLayerTemplate;
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
    constructor(template: IMapRendererLayerTemplate)
    {
      this.template = template;
      this.container = new PIXI.Container();
      this.container.interactiveChildren = template.interactive;
      this.alpha = template.alpha || 1;
    }
    draw(map: GalaxyMap, mapRenderer: MapRenderer)
    {
      if (!this.isDirty) return;
      this.container.removeChildren();
      this.container.addChild(this.template.drawingFunction.call(mapRenderer, map));
      this.isDirty = false;
    }
  }
}
