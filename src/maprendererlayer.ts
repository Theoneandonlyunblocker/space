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
    constructor(template: IMapRendererLayerTemplate)
    {
      this.template = template;
      this.container = new PIXI.Container();
      this.container.interactiveChildren = template.interactive;
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
