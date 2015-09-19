/// <reference path="../lib/pixi.d.ts" />

/// <reference path="maprenderermapmode.ts" />
/// <reference path="maprendererlayer.ts" />
/// <reference path="eventmanager.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="color.ts"/>

/// <reference path="borderpolygon.ts"/>

/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />
/// <reference path="player.ts" />

module Rance
{
  
  export interface IMapRendererMapMode
  {
    name: string;
    displayName: string;
    layers:
    {
      layer: MapRendererLayer;
    }[];
  }
  export class MapRenderer
  {
    container: PIXI.Container;
    parent: PIXI.Container;
    galaxyMap: GalaxyMap;
    player: Player;

    occupationShaders:
    {
      [ownerId: string]:
      {
        [occupierId: string]: PIXI.AbstractFilter;
      };
    } = {};

    layers:
    {
      [name: string]: MapRendererLayer;
    } = {};
    mapModes:
    {
      [name: string]: MapRendererMapMode;
    } = {};

    fowTilingSprite: PIXI.extras.TilingSprite;
    fowSpriteCache:
    {
      [starId: number]: PIXI.Sprite;
    } = {};

    fleetTextTextureCache:
    {
      [fleetSize: number]: PIXI.Texture;
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

      for (var name in this.listeners)
      {
        eventManager.removeEventListener(name, this.listeners[name]);
      }
      
      this.container.removeChildren();
      this.parent.removeChild(this.container);

      this.player = null;
      this.container = null;
      this.parent = null;
      this.occupationShaders = null;
      
      for (var starId in this.fowSpriteCache)
      {
        var sprite = this.fowSpriteCache[starId];
        sprite.renderable = false;
        sprite.texture.destroy(true);
        this.fowSpriteCache[starId] = null;
      }
      for (var fleetSize in this.fleetTextTextureCache)
      {
        var texture = this.fleetTextTextureCache[fleetSize];
        texture.destroy(true);
      }

    }
    init()
    {
      this.makeFowSprite();

      this.initLayers();
      this.initMapModes();

      this.addEventListeners();
    }
    addEventListeners()
    {
      var self = this;
      this.listeners["renderMap"] =
        eventManager.addEventListener("renderMap", this.setAllLayersAsDirty.bind(this));
      this.listeners["renderLayer"] =
        eventManager.addEventListener("renderLayer", function(layerName: string, star?: Star)
      {
        var passesStarVisibilityCheck: boolean = true;
        if (star)
        {
          switch (layerName)
          {
            case "fleets":
            {
              passesStarVisibilityCheck = self.player.starIsVisible(star);
              break;
            }
            default:
            {
              passesStarVisibilityCheck = self.player.starIsRevealed(star);
              break;
            }
          }
        }

        if (passesStarVisibilityCheck || Options.debugMode)
        {
          self.setLayerAsDirty(layerName);
        }
      });

      var boundUpdateOffsets = this.updateShaderOffsets.bind(this);
      var boundUpdateZoom = this.updateShaderZoom.bind(this);

      this.listeners["registerOnMoveCallback"] =
        eventManager.addEventListener("registerOnMoveCallback", function(callbacks: Function[])
        {
          callbacks.push(boundUpdateOffsets);
        });
      this.listeners["registerOnZoomCallback"] =
        eventManager.addEventListener("registerOnZoomCallback", function(callbacks: Function[])
        {
          callbacks.push(boundUpdateZoom);
        });
    }
    setPlayer(player: Player)
    {
      this.player = player;
      this.setAllLayersAsDirty();
    }
    updateShaderOffsets(x: number, y: number)
    {
      for (var owner in this.occupationShaders)
      {
        for (var occupier in this.occupationShaders[owner])
        {
          var shader = this.occupationShaders[owner][occupier];
          shader.uniforms.offset.value = [-x, y];
        }
      }
    }
    updateShaderZoom(zoom: number)
    {
      for (var owner in this.occupationShaders)
      {
        for (var occupier in this.occupationShaders[owner])
        {
          var shader = this.occupationShaders[owner][occupier];
          shader.uniforms.zoom.value = zoom;
        }
      }
    }
    makeFowSprite()
    {
      if (!this.fowTilingSprite)
      {
        var fowTexture = PIXI.Texture.fromFrame("img\/fowTexture.png");
        var w = this.galaxyMap.width;
        var h = this.galaxyMap.height;

        this.fowTilingSprite = new PIXI.extras.TilingSprite(fowTexture, w, h);

      }
    }
    getFowSpriteForStar(star: Star)
    {
      // silly hack to make sure first texture gets created properly
      if (!this.fowSpriteCache[star.id] ||
        Object.keys(this.fowSpriteCache).length < 4)
      {
        var poly = new PIXI.Polygon(star.voronoiCell.vertices);
        var gfx = new PIXI.Graphics();
        gfx.isMask = true;
        gfx.beginFill(0);
        gfx.drawShape(poly);
        gfx.endFill();

        this.fowTilingSprite.removeChildren();

        this.fowTilingSprite.mask = gfx;
        this.fowTilingSprite.addChild(gfx);

        // triggers bounds update that gets skipped if we just call generateTexture()
        var bounds = this.fowTilingSprite.getBounds();

        var rendered = this.fowTilingSprite.generateTexture(app.renderer.renderer, PIXI.SCALE_MODES.DEFAULT, 1, bounds);

        var sprite = new PIXI.Sprite(rendered);

        this.fowSpriteCache[star.id] = sprite;
        this.fowTilingSprite.mask = null;
      }

      return this.fowSpriteCache[star.id];
    }
    getOccupationShader(owner: Player, occupier: Player)
    {
      if (!this.occupationShaders[owner.id])
      {
        this.occupationShaders[owner.id] = {};
      }

      if (!this.occupationShaders[owner.id][occupier.id])
      {
        var baseColor = PIXI.utils.hex2rgb(owner.color);
        baseColor.push(1.0);
        var occupierColor = PIXI.utils.hex2rgb(occupier.color);
        occupierColor.push(1.0);

        var uniforms =
        {
          baseColor: {type: "4fv", value: baseColor},
          lineColor: {type: "4fv", value: occupierColor},
          gapSize: {type: "1f", value: 3.0},
          offset: {type: "2f", value: [0.0, 0.0]},
          zoom: {type: "1f", value: 1.0}
        };

        this.occupationShaders[owner.id][occupier.id] = new OccupationFilter(uniforms);
      }

      return this.occupationShaders[owner.id][occupier.id]
    }
    getFleetTextTexture(fleet: Fleet)
    {
      var fleetSize = fleet.ships.length;

      if (!this.fleetTextTextureCache[fleetSize])
      {
        var text = new PIXI.Text("" + fleet.ships.length,
        {
          fill: "#FFFFFF",
          stroke: "#000000",
          strokeThickness: 3
        });

        // triggers bounds update that gets skipped if we just call generateTexture()
        text.getBounds();

        this.fleetTextTextureCache[fleetSize] = text.generateTexture(app.renderer.renderer);
        window.setTimeout(function()
        {
          text.texture.destroy(true);
        }, 0);
      }

      return this.fleetTextTextureCache[fleetSize];
    }
    initLayers()
    {
      for (var layerKey in app.moduleData.Templates.MapRendererLayers)
      {
        var template = app.moduleData.Templates.MapRendererLayers[layerKey];
        var layer = new MapRendererLayer(template);
        this.layers[layerKey] = layer;
      }
    }
    initMapModes()
    {
      var buildMapMode = function(template: IMapRendererMapModeTemplate)
      {
        var alreadyAdded :
        {
          [layerKey: string]: boolean;
        } = {};
        var mapMode = new MapRendererMapMode(template);
        for (var i = 0; i < template.layers.length; i++)
        {
          var templateLayerData = template.layers[i];
          
          mapMode.addLayer(this.layers[templateLayerData.layer.key], true);
          alreadyAdded[templateLayerData.layer.key] = true;
        }
        for (var layerKey in this.layers)
        {
          if (!alreadyAdded[layerKey])
          {
            mapMode.addLayer(this.layers[layerKey], false);
            alreadyAdded[layerKey] = true;
          }
        }
        this.mapModes[mapModeKey] = mapMode;
      }.bind(this);

      for (var mapModeKey in app.moduleData.Templates.MapRendererMapModes)
      {
        var template = app.moduleData.Templates.MapRendererMapModes[mapModeKey];
        buildMapMode(template);
      }

      var customMapModeTemplate: IMapRendererMapModeTemplate =
      {
        key: "custom",
        displayName: "Custom",
        layers: this.mapModes[Object.keys(this.mapModes)[0]].template.layers
      };

      buildMapMode(customMapModeTemplate);
    }
    setParent(newParent: PIXI.Container)
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
    setLayerAsDirty(layerName: string)
    {
      var layer = this.layers[layerName];
      layer.isDirty = true;

      this.isDirty = true;

      // TODO
      this.render();
    }
    setAllLayersAsDirty()
    {
      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        this.currentMapMode.layers[i].layer.isDirty = true;
      }

      this.isDirty = true;

      // TODO
      this.render();
    }
    updateMapModeLayers(updatedLayers: MapRendererLayer[])
    {
      for (var i = 0; i < updatedLayers.length; i++)
      {
        var layer = updatedLayers[i];
        var childIndex = this.container.getChildIndex(layer.container);
        var mapModeLayerIndex = this.currentMapMode.getLayerIndexInContainer(layer);
        console.log(layer.template.key, mapModeLayerIndex);
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

      var layerData = this.currentMapMode.getActiveLayers();
      for (var i = 0; i < layerData.length; i++)
      {
        var layer = layerData[i].layer;
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
        throw new Error("Invalid mapmode " + newMapMode.template.key);
        return;
      }

      if (this.currentMapMode && this.currentMapMode === newMapMode)
      {
        return;
      }

      this.currentMapMode = newMapMode;

      this.resetContainer();
      
      var layerData = this.currentMapMode.getActiveLayers();
      for (var i = 0; i < layerData.length; i++)
      {
        var layer = layerData[i].layer;
        this.container.addChild(layer.container);
      }

      this.setAllLayersAsDirty();
    }
    render()
    {
      if (this.preventRender || !this.isDirty) return;

      var layerData = this.currentMapMode.getActiveLayers();
      for (var i = 0; i < layerData.length; i++)
      {
        var layer = layerData[i].layer;
        layer.draw(this.galaxyMap, this);
      }

      this.isDirty = false;
    }
  }
}
