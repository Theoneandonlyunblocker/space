/// <reference path="../lib/pixi.d.ts" />

/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />

module Rance
{
  export class MapRenderer
  {
    container: PIXI.DisplayObjectContainer;
    parent: PIXI.DisplayObjectContainer;
    galaxyMap: GalaxyMap;

    layers:
    {
      [name: string]:
      {
        drawingFunction: (MapRenderer) => PIXI.DisplayObjectContainer;
        container: PIXI.DisplayObjectContainer;
      }
    } = {};
    mapModes:
    {
      [name: string]:
      {
        layer: string
      }
    } = {};

    currentMapMode: string;

    constructor(parent: PIXI.DisplayObjectContainer)
    {
      this.container = new PIXI.DisplayObjectContainer();

      this.setParent(parent);
    }
    setParent(newParent: PIXI.DisplayObjectContainer)
    {
      var oldParent = this.parent;
      if (oldParent)
      {
        oldParent.removeChild(this.container);
      }

      this.parent = newParent;
      newParent.addChild(this.container);
    }
    resetContainer()
    {
      this.container.removeChildren();
    }
    removeLayerContainer(layerName: string)
    {
      var layer = this.layers[layerName];

      if (!layer.container) return -1;

      this.container.removeChild(layer.container);


    }
    updateLayer(layerName: string)
    {
      var layer = this.layers[layerName];
      this.removeLayerContainer(layerName);

      var newLayer = layer.drawingFunction.call(null, this);
      layer.container = newLayer;
    }
    switchMapMode(newMapMode: string)
    {
      if (!this.mapModes[newMapMode])
      {
        throw new Error("Invalid mapmode");
        return;
      }
      if (this.currentMapMode === newMapMode)
      {
        return;
      }

      this.currentMapMode = newMapMode;
    }
  }
}
