/// <reference path="../lib/pixi.d.ts" />

import {activeModuleData} from "./activeModuleData";

import MapRendererMapModeTemplate from "./templateinterfaces/MapRendererMapModeTemplate";

import GalaxyMap from "./GalaxyMap";
import MapRendererLayer from "./MapRendererLayer";
import MapRendererMapMode from "./MapRendererMapMode";
import Options from "./Options";
import Player from "./Player";
import Star from "./Star";
import eventManager from "./eventManager";


export default class MapRenderer
{
  container: PIXI.Container;
  parent: PIXI.Container;
  galaxyMap: GalaxyMap;
  player: Player;

  layers:
  {
    [name: string]: MapRendererLayer;
  } = {};
  mapModes:
  {
    [name: string]: MapRendererMapMode;
  } = {};

  currentMapMode: MapRendererMapMode;
  isDirty: boolean = true;
  preventRender: boolean = false;

  listeners:
  {
    [name: string]: Function;
  } = {};


  constructor(map: GalaxyMap, player: Player)
  {
    this.container = new PIXI.Container();

    this.galaxyMap = map;
    this.player = player;
  }
  destroy()
  {
    this.preventRender = true;
    this.container.renderable = false;

    for (const name in this.listeners)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }

    this.container.removeChildren();
    this.parent.removeChild(this.container);

    this.player = null;
    this.container = null;
    this.parent = null;

    for (const layerName in this.layers)
    {
      this.layers[layerName].destroy();
    }
  }
  init()
  {
    this.initLayers();
    this.initMapModes();

    this.addEventListeners();
  }
  addEventListeners()
  {
    this.listeners["renderMap"] =
      eventManager.addEventListener("renderMap", this.setAllLayersAsDirty.bind(this));
    this.listeners["renderLayer"] =
      eventManager.addEventListener("renderLayer", (layerName: string, star?: Star) =>
    {
      let passesStarVisibilityCheck: boolean = true;
      if (star)
      {
        switch (layerName)
        {
          case "fleets":
          {
            passesStarVisibilityCheck = this.player.starIsVisible(star);
            break;
          }
          default:
          {
            passesStarVisibilityCheck = this.player.starIsRevealed(star);
            break;
          }
        }
      }

      if (passesStarVisibilityCheck || Options.debug.enabled)
      {
        this.setLayerAsDirty(layerName);
      }
    });
  }
  setPlayer(player: Player)
  {
    this.player = player;
    this.setAllLayersAsDirty();
  }
  initLayers()
  {
    for (const layerKey in activeModuleData.Templates.MapRendererLayers)
    {
      const template = activeModuleData.Templates.MapRendererLayers[layerKey];
      const layer = new MapRendererLayer(template);
      this.layers[layerKey] = layer;
    }
  }
  initMapModes()
  {
    const buildMapMode = (mapModeKey: string, template: MapRendererMapModeTemplate) =>
    {
      const alreadyAdded:
      {
        [layerKey: string]: boolean;
      } = {};
      const mapMode = new MapRendererMapMode(template);
      for (let i = 0; i < template.layers.length; i++)
      {
        const layer = template.layers[i];

        mapMode.addLayer(this.layers[layer.key], true);
        alreadyAdded[layer.key] = true;
      }
      for (const layerKey in this.layers)
      {
        if (!alreadyAdded[layerKey])
        {
          mapMode.addLayer(this.layers[layerKey], false);
          alreadyAdded[layerKey] = true;
        }
      }
      this.mapModes[mapModeKey] = mapMode;
    };

    for (const mapModeKey in activeModuleData.Templates.MapRendererMapModes)
    {
      const template = activeModuleData.Templates.MapRendererMapModes[mapModeKey];
      buildMapMode(mapModeKey, template);
    }

    // const customMapModeTemplate: MapRendererMapModeTemplate =
    // {
    //   key: "custom",
    //   displayName: "Custom",
    //   layers: this.mapModes[Object.keys(this.mapModes)[0]].template.layers
    // };
    // buildMapMode(customMapModeTemplate);
  }
  setParent(newParent: PIXI.Container)
  {
    const oldParent = this.parent;
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
  public getMapBoundsForCamera(): PIXI.Rectangle
  {
    const boundsLayers = this.currentMapMode.getActiveLayers().filter(layer =>
    {
      return layer.container.width && layer.container.height && layer.template.isUsedForCameraBounds;
    });

    if (boundsLayers.length > 0)
    {
      return boundsLayers.map(layer =>
      {
        return layer.container.getLocalBounds();
      }).reduce((finalBounds, bounds) =>
      {
        if (!finalBounds)
        {
          return bounds.clone();
        }
        else
        {
          finalBounds.enlarge(bounds);

          return finalBounds;
        }
      });
    }
    else
    {
      return this.container.getLocalBounds();
    }
  }
  setLayerAsDirty(layerName: string)
  {
    const layer = this.layers[layerName];
    layer.isDirty = true;

    this.isDirty = true;

    // TODO performance
    this.render();
  }
  setAllLayersAsDirty()
  {
    for (let i = 0; i < this.currentMapMode.layers.length; i++)
    {
      this.currentMapMode.layers[i].isDirty = true;
    }

    this.isDirty = true;

    // TODO performance
    this.render();
  }
  updateMapModeLayers(updatedLayers: MapRendererLayer[])
  {
    for (let i = 0; i < updatedLayers.length; i++)
    {
      const layer = updatedLayers[i];
      const childIndex = this.container.children.indexOf(layer.container);
      const mapModeLayerIndex = this.currentMapMode.getLayerIndexInContainer(layer);
      if (childIndex === -1)
      {
        this.container.addChildAt(layer.container, mapModeLayerIndex);
      }
      else
      {
        this.container.removeChildAt(mapModeLayerIndex + 1);
      }
      this.setLayerAsDirty(layer.template.key);
    }
  }
  resetMapModeLayersPosition()
  {
    this.resetContainer();

    const layerData = this.currentMapMode.getActiveLayers();
    for (let i = 0; i < layerData.length; i++)
    {
      const layer = layerData[i];
      this.container.addChild(layer.container);
    }
  }
  setMapModeByKey(key: string)
  {
    this.setMapMode(this.mapModes[key]);
  }
  setMapMode(newMapMode: MapRendererMapMode)
  {
    if (!this.mapModes[newMapMode.template.key])
    {
      throw new Error(`Invalid mapmode ${newMapMode.template.key}`);
    }

    if (this.currentMapMode && this.currentMapMode === newMapMode)
    {
      return;
    }

    this.currentMapMode = newMapMode;

    this.resetContainer();

    const layerData = this.currentMapMode.getActiveLayers();
    for (let i = 0; i < layerData.length; i++)
    {
      const layer = layerData[i];
      this.container.addChild(layer.container);
    }

    this.setAllLayersAsDirty();
  }
  render()
  {
    if (this.preventRender || !this.isDirty) return;

    const layerData = this.currentMapMode.getActiveLayers();
    for (let i = 0; i < layerData.length; i++)
    {
      const layer = layerData[i];
      layer.draw(this.galaxyMap, this);
    }

    this.isDirty = false;
  }
}
