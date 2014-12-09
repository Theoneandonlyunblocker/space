/// <reference path="../lib/pixi.d.ts" />


/// <reference path="eventmanager.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="color.ts"/>

/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />
/// <reference path="player.ts" />

module Rance
{
  export interface IMapRendererLayer
  {
    drawingFunction: (map: GalaxyMap) => PIXI.DisplayObjectContainer;
    container: PIXI.DisplayObjectContainer;
    isDirty: boolean;
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
    player: Player;

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

    fowTilingSprite: PIXI.TilingSprite;
    fowSpriteCache:
    {
      [starId: number]: PIXI.Sprite;
    } = {};

    currentMapMode: IMapRendererLayerMapMode;
    isDirty: boolean = true;

    constructor()
    {
      this.container = new PIXI.DisplayObjectContainer();

    }
    init()
    {
      this.initLayers();
      this.initMapModes();

      this.addEventListeners();

    }
    addEventListeners()
    {
      var self = this;
      eventManager.addEventListener("renderMap", this.setAllLayersAsDirty.bind(this));
      eventManager.addEventListener("renderLayer", function(e)
      {
        
        self.setLayerAsDirty(e.data);
      });

      renderer.camera.onMove = this.updateShaderOffsets.bind(this);
      renderer.camera.onZoom = this.updateShaderZoom.bind(this);
    }
    changePlayer(player: Player)
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
    makeFowSprite()
    {
      if (!this.fowTilingSprite)
      {
        var fowTexture = PIXI.Texture.fromFrame("img\/fowTexture.png");
        var w = this.galaxyMap.mapGen.maxWidth * 2;
        var h = this.galaxyMap.mapGen.maxHeight * 2;

        this.fowTilingSprite = new PIXI.TilingSprite(fowTexture, w, h);
      }
    }
    getFowSpriteForStar(star: Star)
    {
      if (!this.fowSpriteCache[star.id])
      {
        console.log("makefowsprite")
        var poly = new PIXI.Polygon(star.voronoiCell.vertices);
        var gfx = new PIXI.Graphics();
        gfx.beginFill();
        gfx.drawShape(poly);
        gfx.endFill();

        this.fowTilingSprite.removeChildren();

        this.fowTilingSprite.mask = gfx;
        this.fowTilingSprite.addChild(gfx);

        var rendered = this.fowTilingSprite.generateTexture();

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
          "    gl_FragColor = mix(gl_FragColor, baseColor, 0.5);",
          "  }",
          "  else",
          "  {",
          "    gl_FragColor = mix(gl_FragColor, lineColor, 0.5);",
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
      if (this.layers["nonFillerStars"]) return;
      this.layers["nonFillerStars"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var points: Star[];
          if (!this.player)
          {
            points = map.mapGen.getNonFillerPoints();
          }
          else
          {
            points = this.player.getRevealedStars();
          }

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
            var star = points[i];
            var starSize = 4;
            if (star.buildings["defence"])
            {
              starSize += star.buildings["defence"].length * 3;
            }
            var gfx: any = new PIXI.Graphics();
            gfx.star = star;
            gfx.lineStyle(2, 0x222222, 1);
            gfx.beginFill(0xFFFF00);
            gfx.drawEllipse(star.x, star.y, starSize, starSize);
            gfx.endFill;


            gfx.interactive = true;
            gfx.hitArea = new PIXI.Polygon(star.voronoiCell.vertices);
            gfx.mousedown = mouseDownFN;
            gfx.mouseup = mouseUpFN;
            gfx.click = function(event)
            {
              if (event.originalEvent.button !== 0) return;

              onClickFN(this.star);
            }.bind(gfx);
            gfx.rightclick = rightClickFN.bind(gfx, star);

            doc.addChild(gfx);
          }

          // gets set to 0 without this reference. no idea
          doc.height;
          return doc;
        }
      }
      this.layers["starOwners"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          var points: Star[];
          if (!this.player)
          {
            points = map.mapGen.getNonFillerPoints();
          }
          else
          {
            points = this.player.getRevealedStars();
          }

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            if (!star.owner) continue;

            var poly = new PIXI.Polygon(star.voronoiCell.vertices);
            var gfx = new PIXI.Graphics();
            var alpha = 0.5;
            if (isFinite(star.owner.colorAlpha)) alpha *= star.owner.colorAlpha;
            gfx.beginFill(star.owner.color, alpha);
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
      this.layers["fogOfWar"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          if (!this.player) return doc;
          var points: Star[] = this.player.getRevealedButNotVisibleStars();

          if (!points || points.length < 1) return doc;

          doc.alpha = 0.15;
          
          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            var sprite = this.getFowSpriteForStar(star);

            doc.addChild(sprite);
          }

          doc.height;
          return doc;
        }
      }
      this.layers["starIncome"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          var points: Star[];
          if (!this.player)
          {
            points = map.mapGen.getNonFillerPoints();
          }
          else
          {
            points = this.player.getRevealedStars();
          }
          var incomeBounds = map.getIncomeBounds();

          function getRelativeValue(min: number, max: number, value: number)
          {
            var difference = max - min;
            if (difference < 1) difference = 1;
            // clamps to n different colors
            var threshhold = difference / 10;
            if (threshhold < 1) threshhold = 1;
            var relative = (Math.round(value/threshhold) * threshhold - min) / (difference);
            return relative;
          }

          var colorIndexes:
          {
            [value: number]: number;
          } = {};

          function getRelativeColor(min: number, max: number, value: number)
          {
            if (!colorIndexes[value])
            {
              if (value < 0) value = 0;
              else if (value > 1) value = 1;

              var deviation = Math.abs(0.5 - value) * 2;

              var hue = 110 * value;
              var saturation = 0.5 + 0.2 * deviation;
              var lightness = 0.6 + 0.25 * deviation;

              colorIndexes[value] = hslToHex(hue / 360, saturation, lightness / 2);
            }
            return colorIndexes[value];
          }

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            var income = star.getIncome();
            var relativeIncome = getRelativeValue(incomeBounds.min, incomeBounds.max, income);
            var color = getRelativeColor(incomeBounds.min, incomeBounds.max, relativeIncome);

            var poly = new PIXI.Polygon(star.voronoiCell.vertices);
            var gfx = new PIXI.Graphics();
            gfx.beginFill(color, 0.6);
            gfx.drawShape(poly);
            gfx.endFill;
            doc.addChild(gfx);
          }
          doc.height;
          return doc;
        }
      }
      this.layers["nonFillerVoronoiLines"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var gfx = new PIXI.Graphics();
          doc.addChild(gfx);
          gfx.lineStyle(1, 0xC0C0C0, 0.5);

          var visible = this.player ? this.player.getRevealedStars() : null;

          var lines = map.mapGen.getNonFillerVoronoiLines(visible);

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
      this.layers["ownerBorders"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();
          var gfx = new PIXI.Graphics();
          doc.addChild(gfx);

          gfx.lineStyle(4, player1.secondaryColor, 1);

          
          var players = game.playerOrder;

          for (var i = 0; i < players.length; i++)
          {
            var player = players[i];
            var polys = player.getBorderPolygons();

            for (var j = 0; j < polys.length; j++)
            {
              var poly = polys[j];
              var inset = offsetPolygon(poly, -2);

              if (!inset)
              {
                gfx.lineStyle(4, 0xFF0000, 1);
                gfx.beginFill(0x000000, 0);
                gfx.drawShape(new PIXI.Polygon(poly));
                gfx.endFill;
              }
              else
              {
                gfx.lineStyle(4, player.secondaryColor, 0.7);
                gfx.beginFill(0x000000, 0);
                gfx.drawShape(new PIXI.Polygon(inset));
                gfx.endFill;
              }

            }
          }
          

          doc.height;
          return doc;
        }
      }
      this.layers["starLinks"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var doc = new PIXI.DisplayObjectContainer();

          var gfx = new PIXI.Graphics();
          doc.addChild(gfx);
          gfx.lineStyle(2, 0xDDDDDD, 1);

          var points: Star[];
          if (!this.player)
          {
            points = map.mapGen.getNonFillerPoints();
          }
          else
          {
            points = this.player.getRevealedStars();
          }

          var starsFullyConnected:
          {
            [id: number]: boolean;
          } = {};

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
            if (starsFullyConnected[star.id]) continue;

            starsFullyConnected[star.id] = true;

            for (var j = 0; j < star.linksTo.length; j++)
            {
              gfx.moveTo(star.x, star.y);
              gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
            }
            for (var j = 0; j < star.linksFrom.length; j++)
            {
              gfx.moveTo(star.linksFrom[j].x, star.linksFrom[j].y);
              gfx.lineTo(star.x, star.y);
            }
          }
          doc.height;
          return doc;
        }
      }
      this.layers["fleets"] =
      {
        isDirty: true,
        container: new PIXI.DisplayObjectContainer(),
        drawingFunction: function(map: GalaxyMap)
        {
          var self = this;

          var doc = new PIXI.DisplayObjectContainer();

          var points: Star[];
          if (!this.player)
          {
            points = map.mapGen.getNonFillerPoints();
          }
          else
          {
            points = this.player.getVisibleStars();
          }

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
            if (fleet.player.id === self.player.id)
            {
              containerGfx.click = fleetClickFn.bind(containerGfx, fleet);
            }

            containerGfx.mousedown = mouseDownFN;
            containerGfx.mouseup = mouseUpFN;

            containerGfx.addChild(text);
            text.x += 2;
            text.y += 2;
            containerGfx.y -= 10;
            fleetContainer.addChild(containerGfx);

            return fleetContainer;
          }

          for (var i = 0; i < points.length; i++)
          {
            var star = points[i];
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
          {layer: this.layers["ownerBorders"]},
          {layer: this.layers["nonFillerVoronoiLines"]},
          {layer: this.layers["starLinks"]},
          {layer: this.layers["nonFillerStars"]},
          {layer: this.layers["fogOfWar"]},
          {layer: this.layers["fleets"]}
        ]
      }
      this.mapModes["noLines"] =
      {
        name: "noLines",
        layers:
        [
          {layer: this.layers["starOwners"]},
          {layer: this.layers["starLinks"]},
          {layer: this.layers["nonFillerStars"]},
          {layer: this.layers["fleets"]}
        ]
      }
      this.mapModes["income"] =
      {
        name: "income",
        layers:
        [
          {layer: this.layers["starIncome"]},
          {layer: this.layers["nonFillerVoronoiLines"]},
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
    hasLayerInMapMode(layer: IMapRendererLayer)
    {
      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        if (this.currentMapMode.layers[i].layer === layer)
        {
          return true;
        }
      }

      return false;
    }
    setLayerAsDirty(layerName: string)
    {
      console.log("dirty: " + layerName)
      var layer = this.layers[layerName];
      layer.isDirty = true;

      this.isDirty = true;

      // TODO
      this.render();
    }
    setAllLayersAsDirty()
    {
      console.log("dirty: all")
      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        this.currentMapMode.layers[i].layer.isDirty = true;
      }

      this.isDirty = true;

      // TODO
      this.render();
    }
    drawLayer(layer: IMapRendererLayer)
    {
      if (!layer.isDirty) return;
      layer.container.removeChildren();
      layer.container.addChild(layer.drawingFunction.call(this, this.galaxyMap));
      layer.isDirty = false;
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
      
      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        var layer = this.currentMapMode.layers[i].layer;
        this.container.addChild(layer.container);
      }

      this.setAllLayersAsDirty();
    }
    render()
    {
      if (!this.isDirty) return;

      for (var i = 0; i < this.currentMapMode.layers.length; i++)
      {
        var layer = this.currentMapMode.layers[i].layer;

        this.drawLayer(layer);
      }

      this.isDirty = false;
    }
  }
}
