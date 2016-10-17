import MapRendererMapModeTemplate from "./templateinterfaces/MapRendererMapModeTemplate";

import MapRendererLayer from "./MapRendererLayer";

export default class MapRendererMapMode
{
  template: MapRendererMapModeTemplate;
  displayName: string;
  layers: MapRendererLayer[] = [];
  activeLayers:
  {
    [layerName: string]: boolean;
  } = {};
  constructor(template: MapRendererMapModeTemplate)
  {
    this.template = template;
    this.displayName = template.displayName;
  }
  addLayer(layer: MapRendererLayer, isActive: boolean = true)
  {
    if (this.hasLayer(layer))
    {
      throw new Error("Tried to add duplicate layer " + layer.template.key);
    }

    this.layers.push(layer);

    this.activeLayers[layer.template.key] = isActive;
  }
  getLayerIndex(layer: MapRendererLayer)
  {
    for (let i = 0; i < this.layers.length; i++)
    {
      if (this.layers[i] === layer) return i;
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
    for (let i = 0; i < this.layers.length; i++)
    {
      if (this.activeLayers[this.layers[i].template.key])
      {
        index++;
      }
      if (this.layers[i] === layer) return index;
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
    const prevIndex = this.getLayerIndex(layer);

    this.layers.splice(prevIndex, 1);
    this.layers.splice(newIndex, 0, layer);
  }
  insertLayerNextToLayer(toInsert: MapRendererLayer, target: MapRendererLayer, position: string)
  {
    var indexAdjust = (position === "top" ? 0 : 1);

    var newIndex = this.getLayerIndex(target) + indexAdjust;
    this.setLayerIndex(toInsert, newIndex);
  }
  getActiveLayers(): MapRendererLayer[]
  {
    var self = this;
    return(this.layers.filter(function(layer: MapRendererLayer)
    {
      return self.activeLayers[layer.template.key];
    }));
  }
  resetLayers()
  {
    var layersByKey:
    {
      [key: string]: MapRendererLayer;
    } = {};

    var newLayers: MapRendererLayer[] = [];
    var newActive:
    {
      [layerName: string]: boolean;
    } = {};

    for (let i = 0; i < this.layers.length; i++)
    {
      var layer = this.layers[i];
      layersByKey[layer.template.key] = layer;
    }

    for (let i = 0; i < this.template.layers.length; i++)
    {
      var layerTemplate = this.template.layers[i];
      var layer = layersByKey[layerTemplate.key];
      newLayers.push(layer);
      newActive[layerTemplate.key] = true;

      delete layersByKey[layerTemplate.key];
    }

    for (let key in layersByKey)
    {
      var layer = layersByKey[key];
      newLayers.push(layer);
      newActive[key] = false;
    }

    this.layers = newLayers;
    this.activeLayers = newActive;
    
    for (let i = 0; i < this.layers.length; i++)
    {
      this.layers[i].resetAlpha();
    }
  }
}
