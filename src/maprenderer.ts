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

    occupationShaders:
    {
      [ownerId: string]:
      {
        [occupierId: string]: any; //shader
      };
    } = {};

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

      this.addEventListeners();
    }
    addEventListeners()
    {
      eventManager.addEventListener("renderMap", this.render.bind(this));

      renderer.camera.onMove = this.updateShaderOffsets.bind(this);
      renderer.camera.onZoom = this.updateShaderZoom.bind(this);
    }
    updateShaderOffsets(x: number, y: number)
    {
      for (var owner in this.occupationShaders)
      {
        for (var occupier in this.occupationShaders[owner])
        {
          var shader = this.occupationShaders[owner][occupier];
          shader.uniforms.offset.value = {x: -x, y: y};
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
    getOccupationShader(owner: Player, occupier: Player)
    {
      if (!this.occupationShaders[owner.id])
      {
        this.occupationShaders[owner.id] = {};
      }

      if (!this.occupationShaders[owner.id][occupier.id])
      {
        var baseColor = PIXI.hex2rgb(owner.color);
        baseColor.push(1.0);
        var occupierColor = PIXI.hex2rgb(occupier.color);
        occupierColor.push(1.0);

        var uniforms =
        {
          baseColor: {type: "4fv", value: baseColor},
          lineColor: {type: "4fv", value: occupierColor},
          gapSize: {type: "1f", value: 3.0},
          offset: {type: "2f", value: {x: 0.0, y: 0.0}},
          zoom: {type: "1f", value: 1.0}
        };

        var shaderSrc =
        [
          "precision mediump float;",

          "uniform sampler2D uSampler;",

          "varying vec2 vTextureCoord;",
          "varying vec4 vColor;",

          "uniform vec4 baseColor;",
          "uniform vec4 lineColor;",
          "uniform float gapSize;",
          "uniform vec2 offset;",
          "uniform float zoom;",

          "void main( void )",
          "{",
          "  vec2 position = gl_FragCoord.xy + offset;",
          "  position.x += position.y;",
          "  float scaled = floor(position.x * 0.1 / zoom);",
          "  float res = mod(scaled, gapSize);",
          "  if(res > 0.0)",
          "  {",
          "    gl_FragColor = mix(baseColor, gl_FragColor, 0.3);",
          "  }",
          "  else",
          "  {",
          "    gl_FragColor = mix(lineColor, gl_FragColor, 0.3);",
          "  }",
          "}"
        ];

        this.occupationShaders[owner.id][occupier.id] = new PIXI.AbstractFilter(
          shaderSrc, uniforms);
      }

      return this.occupationShaders[owner.id][occupier.id]
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

          var mouseDownFN = function(event)
          {
            eventManager.dispatchEvent("mouseDown", event);
          }
          var mouseUpFN = function(event)
          {
            eventManager.dispatchEvent("mouseUp", event);
          }
          var onClickFN = function(star)
          {
            eventManager.dispatchEvent("starClick", star);
          }
          var rightClickFN = function(star)
          {
            eventManager.dispatchEvent("starRightClick", star);
          }
          for (var i = 0; i < points.length; i++)
          {
            var gfx: any = new PIXI.Graphics();
            gfx.star = points[i];
            gfx.lineStyle(2, 0x222222, 1);
            gfx.beginFill(0xFFFF00);
            gfx.drawEllipse(points[i].x, points[i].y, 6, 6);
            gfx.endFill;

            gfx.interactive = true;
            gfx.hitArea = new PIXI.Polygon(points[i].voronoiCell.vertices);
            gfx.mousedown = mouseDownFN;
            gfx.mouseup = mouseUpFN;
            gfx.click = function(event)
            {
              if (event.originalEvent.button !== 0) return;

              onClickFN(this.star);
            }.bind(gfx);
            gfx.rightclick = rightClickFN.bind(gfx, points[i]);

            doc.addChild(gfx);
          }

          // gets set to 0 without this reference. no idea
          doc.height;
          return doc;
        }
      }
      this.layers["starOwners"] =
      {
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          var points = map.mapGen.getNonFillerPoints();

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            if (!star.owner) continue;

            var poly = new PIXI.Polygon(star.voronoiCell.vertices);
            var gfx = new PIXI.Graphics();
            gfx.beginFill(star.owner.color, 0.7);
            gfx.drawShape(poly);
            gfx.endFill;
            doc.addChild(gfx);
            

            var occupier = star.getSecondaryController();
            if (occupier)
            {
              gfx.filters = [this.getOccupationShader(star.owner, occupier)];
              //gfx.filters = [testFilter];
              var mask = new PIXI.Graphics();
              mask.beginFill();
              mask.drawShape(poly);
              mask.endFill();
              gfx.mask = mask;
              gfx.addChild(mask);
            }
          }
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
          gfx.lineStyle(1, 0x00FF00, 1);

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
          gfx.lineStyle(2, 0xDDDDDD, 1);

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

          var mouseDownFN = function(event)
          {
            eventManager.dispatchEvent("mouseDown", event);
          }
          var mouseUpFN = function(event)
          {
            eventManager.dispatchEvent("mouseUp", event);
          }

          function fleetClickFn(fleet: Fleet)
          {
            eventManager.dispatchEvent("selectFleets", [fleet]);
          }

          function singleFleetDrawFN(fleet: Fleet)
          {
            var fleetContainer = new PIXI.DisplayObjectContainer();
            var playerColor = fleet.player.color;

            var text = new PIXI.Text(fleet.ships.length,
            {
              //fill: "#" + playerColor.toString(16)
              fill: "#FFFFFF",
              stroke: "#000000",
              strokeThickness: 3
            });

            var containerGfx = new PIXI.Graphics();
            containerGfx.lineStyle(1, 0x00000, 1);
            containerGfx.beginFill(playerColor, 0.7);
            containerGfx.drawRect(0, 0, text.width+4, text.height+4);
            containerGfx.endFill();

            containerGfx.interactive = true;
            containerGfx.click = fleetClickFn.bind(containerGfx, fleet);
            containerGfx.mousedown = mouseDownFN;
            containerGfx.mouseup = mouseUpFN;

            containerGfx.addChild(text);
            text.x += 2;
            text.y += 2;
            containerGfx.y -= 10;
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
          {layer: this.layers["starOwners"]},
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
