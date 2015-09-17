/// <reference path="templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="maprendererlayer.ts" />

module Rance
{
  export class MapRendererMapMode
  {
    template: IMapRendererMapModeTemplate;
    layers:
    {
      layer: MapRendererLayer;
    }[] = [];
    constructor(template: IMapRendererMapModeTemplate)
    {
      this.template = template;
    }
    addLayer(layer: MapRendererLayer)
    {
      if (this.hasLayer(layer))
      {
        throw new Error("Tried to add duplicate layer " + layer.template.key);
        return;
      }

      this.layers.push(
      {
        layer: layer
      });
    }
    getLayerIndex(layer: MapRendererLayer)
    {
      for (var i = 0; i < this.layers.length; i++)
      {
        if (this.layers[i].layer === layer) return i;
      }

      return -1;
    }
    hasLayer(layer: MapRendererLayer)
    {
      return this.getLayerIndex(layer) !== -1;
    }
  }
}