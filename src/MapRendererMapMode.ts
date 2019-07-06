import {MapRendererMapModeTemplate} from "./templateinterfaces/MapRendererMapModeTemplate";

import {MapRendererLayer} from "./MapRendererLayer";


export class MapRendererMapMode
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
      throw new Error(`Tried to add duplicate layer ${layer.template.key}`);
    }

    this.layers.push(layer);

    this.activeLayers[layer.template.key] = isActive;
  }
  hasLayer(layer: MapRendererLayer)
  {
    return this.layers.indexOf(layer) !== -1;
  }
  getLayerIndexInContainer(layer: MapRendererLayer)
  {
    let index = -1;
    for (let i = 0; i < this.layers.length; i++)
    {
      if (this.activeLayers[this.layers[i].template.key])
      {
        index++;
      }
      if (this.layers[i] === layer) { return index; }
    }

    throw new Error(`Map mode doesn't have layer ${layer.template.key}`);
  }
  toggleLayer(layer: MapRendererLayer)
  {
    this.activeLayers[layer.template.key] = !this.activeLayers[layer.template.key];
    if (!this.hasLayer(layer))
    {
      this.addLayer(layer);
    }
  }
  public moveLayer(toInsert: MapRendererLayer, target: MapRendererLayer, position: "top" | "bottom"): void
  {
    const indexAdjust = (position === "top" ? 0 : 1);

    const prevIndex = this.layers.indexOf(toInsert);
    this.layers.splice(prevIndex, 1);

    const newIndex = this.layers.indexOf(target) + indexAdjust;
    this.layers.splice(newIndex, 0, toInsert);
  }
  getActiveLayers(): MapRendererLayer[]
  {
    return(this.layers.filter(layer =>
    {
      return this.activeLayers[layer.template.key];
    }));
  }
  resetLayers()
  {
    const layersByKey:
    {
      [key: string]: MapRendererLayer;
    } = {};

    const newLayers: MapRendererLayer[] = [];
    const newActive:
    {
      [layerName: string]: boolean;
    } = {};

    for (let i = 0; i < this.layers.length; i++)
    {
      const layer = this.layers[i];
      layersByKey[layer.template.key] = layer;
    }

    for (let i = 0; i < this.template.layers.length; i++)
    {
      const layerTemplate = this.template.layers[i];
      const layer = layersByKey[layerTemplate.key];
      newLayers.push(layer);
      newActive[layerTemplate.key] = true;

      delete layersByKey[layerTemplate.key];
    }

    for (const key in layersByKey)
    {
      const layer = layersByKey[key];
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
