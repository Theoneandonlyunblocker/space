/// <reference path="templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="maprendererlayer.ts" />

module Rance
{
  export interface IMapRendererMapModeLayerData
  {
    layer: MapRendererLayer;
  }
  export class MapRendererMapMode
  {
    template: IMapRendererMapModeTemplate;
    displayName: string;
    layers: IMapRendererMapModeLayerData[] = [];
    activeLayers:
    {
      [layerName: string]: boolean;
    } = {};
    constructor(template: IMapRendererMapModeTemplate)
    {
      this.template = template;
      this.displayName = template.displayName;
    }
    addLayer(layer: MapRendererLayer, isActive: boolean = true)
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

      this.activeLayers[layer.template.key] = isActive;
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
    getLayerIndexInContainer(layer: MapRendererLayer)
    {
      var index = -1;
      for (var i = 0; i < this.layers.length; i++)
      {
        if (this.activeLayers[this.layers[i].layer.template.key])
        {
          index++;
        }
        if (this.layers[i].layer === layer) return index;
      }

      throw new Error("Map mode doesn't have layer " + layer.template.key);
    }
    toggleLayer(layer: MapRendererLayer)
    {
      this.activeLayers[layer.template.key] = !this.activeLayers[layer.template.key];
      if (!this.hasLayer(layer))
      {
        this.addLayer(layer);
      }
    }
    setLayerIndex(layer: MapRendererLayer, newIndex: number)
    {
      var prevIndex = this.getLayerIndex(layer);
      var spliced = this.layers.splice(prevIndex, 1)[0];
      this.layers.splice(newIndex, 0, spliced);
    }
    insertLayerNextToLayer(toInsert: MapRendererLayer, target: MapRendererLayer, position: string)
    {
      var indexAdjust = (position === "top" ? -1 : 0);

      var newIndex = this.getLayerIndex(target) + indexAdjust;
      this.setLayerIndex(toInsert, newIndex);
    }
    getActiveLayers(): IMapRendererMapModeLayerData[]
    {
      var self = this;
      return(this.layers.filter(function(layerData: IMapRendererMapModeLayerData)
      {
        return self.activeLayers[layerData.layer.template.key];
      }));
    }
  }
}