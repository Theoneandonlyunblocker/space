/// <reference path="../lib/pixi.d.ts" />

/// <reference path="eventmanager.ts"/>
/// <reference path="utility.ts"/>

/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />

module Rance
{
  export interface IMapRendererLayer
  {
    drawingFunction: (map: GalaxyMap) => PIXI.DisplayObjectContainer;
    container: PIXI.DisplayObjectContainer;
  }
  export interface IMapRendererLayerMapMode
  {
    name: string;
    layers:
    {
      layer: IMapRendererLayer;
    }[];
  }
  export class MapRenderer
  {
    container: PIXI.DisplayObjectContainer;
    parent: PIXI.DisplayObjectContainer;
    galaxyMap: GalaxyMap;

    layers:
    {
      [name: string]: IMapRendererLayer;
    } = {};
    mapModes:
    {
      [name: string]: IMapRendererLayerMapMode;
    } = {};

    TextureCache:
    {
      [name: string]: PIXI.Texture;
    } = {};

    currentMapMode: IMapRendererLayerMapMode;

    constructor()
    {
      this.container = new PIXI.DisplayObjectContainer();

      this.initLayers();
      this.initMapModes();
    }
    initLayers()
    {
      this.layers["nonFillerStars"] =
      {
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var points = map.mapGen.getNonFillerPoints();

          var onClickFN = function(star)
          {
            eventManager.dispatchEvent("starClick",
            {
              star: star
            });
          }
          for (var i = 0; i < points.length; i++)
          {
            var gfx = new PIXI.Graphics();
            gfx.lineStyle(3, 0x00000, 1);
            gfx.beginFill(0xFFFFFF);
            gfx.drawEllipse(points[i].x, points[i].y, 6, 6);
            gfx.endFill;

            gfx.interactive = true;
            gfx.click = onClickFN.bind(gfx, points[i]);

            doc.addChild(gfx);
          }

          // gets set to 0 without this reference. no idea
          doc.height;
          return doc;
        }
      }
      this.layers["nonFillerVoronoiLines"] =
      {
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var gfx = new PIXI.Graphics();
          doc.addChild(gfx);
          gfx.lineStyle(1, 0xFF000, 1);

          var lines = map.mapGen.getNonFillerVoronoiLines();

          for (var i = 0; i < lines.length; i++)
          {
            var line = lines[i];
            gfx.moveTo(line.va.x, line.va.y);
            gfx.lineTo(line.vb.x, line.vb.y);
          }

          doc.height;
          return doc;
        }
      }
      this.layers["starLinks"] =
      {
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var gfx = new PIXI.Graphics();
          doc.addChild(gfx);
          gfx.lineStyle(3, 0x00000, 1);

          var points = map.mapGen.getNonFillerPoints();

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            var links = star.linksTo;

            for (var j = 0; j < links.length; j++)
            {
              gfx.moveTo(star.x, star.y);
              gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
            }
          }

          doc.height;
          return doc;
        }
      }
      this.layers["fleets"] =
      {
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          var stars = map.mapGen.getNonFillerPoints();

          function fleetClickFn(fleet: Fleet)
          {
            var friendlyFleets = fleet.getFriendlyFleetsAtOwnLocation();

            eventManager.dispatchEvent("selectFleets", friendlyFleets);
          }

          function singleFleetDrawFN(fleet: Fleet)
          {
            var fleetContainer = new PIXI.DisplayObjectContainer();
            var playerColor = fleet.player.color;

            var text = new PIXI.Text(fleet.ships.length,
            {
              fill: "#" + playerColor.toString(16)
            });

            var containerGfx = new PIXI.Graphics();
            containerGfx.lineStyle(1, 0x00000, 1);
            containerGfx.beginFill(playerColor, 0.4);
            containerGfx.drawRect(0, 0, text.width+4, text.height+4);
            containerGfx.endFill();

            containerGfx.interactive = true;
            containerGfx.click = fleetClickFn.bind(containerGfx, fleet);

            containerGfx.addChild(text);
            text.x += 2;
            text.y += 2;
            fleetContainer.addChild(containerGfx);

            return fleetContainer;
          }

          for (var i = 0; i < stars.length; i++)
          {
            var star = stars[i];
            var fleets = star.getAllFleets();
            if (!fleets || fleets.length <= 0) continue;

            var fleetsContainer = new PIXI.DisplayObjectContainer();
            fleetsContainer.x = star.x;
            fleetsContainer.y = star.y - 30;
            doc.addChild(fleetsContainer);

            for (var j = 0; j < fleets.length; j++)
            {
              var drawnFleet = singleFleetDrawFN(fleets[j]);
              drawnFleet.position.x = fleetsContainer.width;
              fleetsContainer.addChild(drawnFleet);
            }

            fleetsContainer.x -= fleetsContainer.width / 2;
          }

          doc.height;
          return doc;
        }
      }
    }
    initMapModes()
    {
      this.mapModes["default"] =
      {
        name: "default",
        layers:
        [
          {layer: this.layers["nonFillerVoronoiLines"]},
          {layer: this.layers["starLinks"]},
          {layer: this.layers["nonFillerStars"]},
          {layer: this.layers["fleets"]}
        ]
      }
      this.mapModes["noLines"] =
      {
        name: "noLines",
        layers:
        [
          {layer: this.layers["starLinks"]},
          {layer: this.layers["nonFillerStars"]},
          {layer: this.layers["fleets"]}
        ]
      }
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
    drawLayer(layer: IMapRendererLayer)
    {
      layer.container.removeChildren();
      layer.container.addChild(layer.drawingFunction.call(this, this.galaxyMap));
    }
    setMapMode(newMapMode: string)
    {
      if (!this.mapModes[newMapMode])
      {
        throw new Error("Invalid mapmode");
        return;
      }

      if (this.currentMapMode && this.currentMapMode.name === newMapMode)
      {
        return;
      }

      this.currentMapMode = this.mapModes[newMapMode];

      this.resetContainer();
      this.render();
    }
    render()
    {
      this.resetContainer();

      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        var layer = this.currentMapMode.layers[i].layer;

        this.drawLayer(layer);
        this.container.addChild(layer.container);
      }
    }
  }
}
