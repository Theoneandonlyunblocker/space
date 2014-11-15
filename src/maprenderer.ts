/// <reference path="../lib/pixi.d.ts" />

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

    currentMapMode: IMapRendererLayerMapMode;

    constructor(parent: PIXI.DisplayObjectContainer)
    {
      this.container = new PIXI.DisplayObjectContainer();

      this.setParent(parent);

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

          var gfx = new PIXI.Graphics();
          gfx.lineStyle(3, 0x00000, 1);
          gfx.beginFill(0xFFFFFF);
          gfx.drawEllipse(0, 0, 6, 6);
          gfx.endFill;
          var starTexture = gfx.generateTexture();

          var points = map.mapGen.getNonFillerPoints();
          for (var i = 0; i < points.length; i++)
          {
            var starSprite = new PIXI.Sprite(starTexture);
            starSprite.anchor.x = 0.5;
            starSprite.anchor.y = 0.5;
            starSprite.x = points[i].x;
            starSprite.y = points[i].y;
            doc.addChild(starSprite);
          }

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
          {layer: this.layers["nonFillerStars"]}
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
      layer.container.addChild(layer.drawingFunction(this.galaxyMap));
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
