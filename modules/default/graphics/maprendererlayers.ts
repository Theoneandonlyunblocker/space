/// <reference path="../../../src/templateinterfaces/imaprendererlayertemplate.d.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace MapRendererLayers
      {
        export var nonFillerStars: IMapRendererLayerTemplate =
        {
          key: "nonFillerStars",
          displayName: "Stars",
          interactive: true,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();

            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getRevealedStars();
            }

            var mouseDownFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("mouseDown", event, this);
            }
            var mouseUpFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("mouseUp", event);
            }
            var onClickFN = function(star: Star)
            {
              eventManager.dispatchEvent("starClick", star);
            }
            var mouseOverFN = function(star: Star)
            {
              eventManager.dispatchEvent("hoverStar", star);
            }
            var mouseOutFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("clearHover");
            }
            var touchStartFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("touchStart", event);
            }
            var touchEndFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("touchEnd", event);
            }
            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              var starSize = 1;
              if (star.buildings["defence"])
              {
                starSize += star.buildings["defence"].length * 2;
              }
              var gfx = new PIXI.Graphics();
              if (!star.owner.isIndependent)
              {
                gfx.lineStyle(starSize / 2, star.owner.color, 1);
              }
              gfx.beginFill(0xFFFFF0);
              gfx.drawCircle(star.x, star.y, starSize);
              gfx.endFill();


              gfx.interactive = true;
              gfx.hitArea = new PIXI.Polygon(star.voronoiCell.vertices);

              var boundMouseDown = mouseDownFN.bind(star);
              var gfxClickFN = function(event: PIXI.interaction.InteractionEvent)
              {
                var originalEvent = <MouseEvent> event.data.originalEvent;
                if (originalEvent.button) return;

                onClickFN(this);
              }.bind(star);

              gfx.on("mousedown", boundMouseDown);
              gfx.on("mouseup", mouseUpFN);
              gfx.on("rightdown", boundMouseDown);
              gfx.on("rightup", mouseUpFN);
              gfx.on("click", gfxClickFN);
              gfx.on("mouseover", mouseOverFN.bind(gfx, star));
              gfx.on("mouseout", mouseOutFN);
              gfx.on("tap", gfxClickFN);

              doc.addChild(gfx);
            }

            doc.interactive = true;

            // cant be set on gfx as touchmove and touchend only register
            // on the object that had touchstart called on it
            doc.on("touchstart", touchStartFN);
            doc.on("touchend", touchEndFN);
            doc.on("touchmove", function(event: PIXI.interaction.InteractionEvent)
            {
              var local = event.data.getLocalPosition(doc);
              var starAtLocal = map.voronoi.getStarAtPoint(local);
              if (starAtLocal)
              {
                eventManager.dispatchEvent("hoverStar", starAtLocal);
              }
            });

            return doc;
          }
        }
        export var starOwners: IMapRendererLayerTemplate =
        {
          key: "starOwners",
          displayName: "Star owners",
          interactive: false,
          alpha: 0.5,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getRevealedStars();
            }

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              var occupier = star.getSecondaryController();
              if (!star.owner || (!occupier && star.owner.colorAlpha === 0)) continue;

              var poly = new PIXI.Polygon(star.voronoiCell.vertices);
              var gfx = new PIXI.Graphics();
              var alpha = 1;
              if (isFinite(star.owner.colorAlpha)) alpha *= star.owner.colorAlpha;
              gfx.beginFill(star.owner.color, alpha);
              gfx.drawShape(poly);
              gfx.endFill();

              if (occupier)
              {
                var container = new PIXI.Container();
                doc.addChild(container);

                var mask = new PIXI.Graphics();
                mask.isMask = true;
                mask.beginFill(0);
                mask.drawShape(poly);
                mask.endFill();

                container.addChild(gfx);
                container.addChild(mask);
                gfx.filters = [this.getOccupationShader(star.owner, occupier)];
                container.mask = mask;
              }
              else
              {
                doc.addChild(gfx);
              }
            }
            return doc;
          }
        }
        export var fogOfWar: IMapRendererLayerTemplate =
        {
          key: "fogOfWar",
          displayName: "Fog of war",
          interactive: false,
          alpha: 0.35,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            if (!this.player) return doc;
            var points: Star[] = this.player.getRevealedButNotVisibleStars();

            if (!points || points.length < 1) return doc;

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              var sprite = this.getFowSpriteForStar(star);

              doc.addChild(sprite);
            }

            return doc;
          }
        }
        export var starIncome: IMapRendererLayerTemplate =
        {
          key: "starIncome",
          displayName: "Income",
          interactive: false,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
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
              gfx.endFill();
              doc.addChild(gfx);
            }
            return doc;
          }
        }
        export var playerInfluence: IMapRendererLayerTemplate =
        {
          key: "playerInfluence",
          displayName: "Influence",
          interactive: false,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getRevealedStars();
            }
            var mapEvaluator = new MapAI.MapEvaluator(map, this.player);
            var influenceByStar = mapEvaluator.buildPlayerInfluenceMap(this.player);

            var minInfluence: number, maxInfluence: number;

            for (var starId in influenceByStar)
            {
              var influence = influenceByStar[starId];
              if (!isFinite(minInfluence) || influence < minInfluence)
              {
                minInfluence = influence;
              }
              if (!isFinite(maxInfluence) || influence > maxInfluence)
              {
                maxInfluence = influence;
              }
            }

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
              var influence = influenceByStar[star.id];

              if (!influence) continue;

              var relativeInfluence = getRelativeValue(minInfluence, maxInfluence, influence);
              var color = getRelativeColor(minInfluence, maxInfluence, relativeInfluence);

              var poly = new PIXI.Polygon(star.voronoiCell.vertices);
              var gfx = new PIXI.Graphics();
              gfx.beginFill(color, 0.6);
              gfx.drawShape(poly);
              gfx.endFill;
              doc.addChild(gfx);
            }
            return doc;
          }
        }
        export var nonFillerVoronoiLines: IMapRendererLayerTemplate =
        {
          key: "nonFillerVoronoiLines",
          displayName: "Star borders",
          interactive: false,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();

            var gfx = new PIXI.Graphics();
            doc.addChild(gfx);
            gfx.lineStyle(1, 0xA0A0A0, 0.5);

            var visible = this.player ? this.player.getRevealedStars() : null;

            var lines = map.voronoi.getNonFillerVoronoiLines(visible);

            for (var i = 0; i < lines.length; i++)
            {
              var line = lines[i];
              gfx.moveTo(line.va.x, line.va.y);
              gfx.lineTo(line.vb.x, line.vb.y);
            }

            return doc;
          }
        }
        export var ownerBorders: IMapRendererLayerTemplate =
        {
          key: "ownerBorders",
          displayName: "Owner borders",
          interactive: false,
          alpha: 0.7,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            if (Options.display.borderWidth <= 0)
            {
              return doc;
            }

            var revealedStars = this.player.getRevealedStars();
            var borderEdges = getRevealedBorderEdges(revealedStars, map.voronoi);

            for (var i = 0; i < borderEdges.length; i++)
            {
              var gfx = new PIXI.Graphics();
              doc.addChild(gfx);
              var polyLineData = borderEdges[i];
              var player = polyLineData.points[0].star.owner;
              gfx.lineStyle(Options.display.borderWidth, player.secondaryColor, 1);

              var polygon = new PIXI.Polygon(polyLineData.points);
              polygon.closed = polyLineData.isClosed;
              gfx.drawShape(polygon);
            }

            return doc;
          }
        }
        export var starLinks: IMapRendererLayerTemplate =
        {
          key: "starLinks",
          displayName: "Links",
          interactive: false,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();

            var gfx = new PIXI.Graphics();
            doc.addChild(gfx);
            gfx.lineStyle(1, 0xCCCCCC, 0.6);

            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
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
            return doc;
          }
        }
        export var resources: IMapRendererLayerTemplate =
        {
          key: "resources",
          displayName: "Resources",
          interactive: false,
          drawingFunction: function(map: GalaxyMap)
          {
            var self = this;

            var doc = new PIXI.Container();

            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getRevealedStars();
            }

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              if (!star.resource) continue;

              var text = new PIXI.Text(star.resource.displayName,
              {
                fill: "#FFFFFF",
                stroke: "#000000",
                strokeThickness: 2
              });

              text.x = star.x;
              text.x -= text.width / 2;
              text.y = star.y + 8;

              doc.addChild(text);
            }

            return doc;
          }
        }
        export var fleets: IMapRendererLayerTemplate =
        {
          key: "fleets",
          displayName: "Fleets",
          interactive: true,
          drawingFunction: function(map: GalaxyMap)
          {
            var self = this;

            var doc = new PIXI.Container();

            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getVisibleStars();
            }

            var mouseDownFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("mouseDown", event, this.location);
            }
            var mouseUpFN = function(event: PIXI.interaction.InteractionEvent)
            {
              eventManager.dispatchEvent("mouseUp", event);
            }
            var mouseOverFN = function(fleet: Fleet)
            {
              eventManager.dispatchEvent("hoverStar", fleet.location);
              if (Options.debugMode && fleet.units.length > 0 && fleet.units[0].front)
              {
                var objective = fleet.units[0].front.objective;
                var target = objective.target ? objective.target.id : null;
                console.log(objective.type, target, objective.priority);
              }
            }
            function fleetClickFn(event: PIXI.interaction.InteractionEvent)
            {
              var originalEvent = <MouseEvent> event.data.originalEvent;;
              if (originalEvent.button === 0)
              {
                eventManager.dispatchEvent("selectFleets", [this]);
              }
            }
            function singleFleetDrawFN(fleet: Fleet)
            {
              var fleetContainer = new PIXI.Container();

              var color = fleet.player.color;
              var fillAlpha = fleet.isStealthy ? 0.3 : 0.7;

              var textTexture = self.getFleetTextTexture(fleet);
              var text = new PIXI.Sprite(textTexture);

              var containerGfx = new PIXI.Graphics();
              containerGfx.lineStyle(1, 0x00000, 1);
              // debug
              var front = fleet.units[0].front;
              if (front && Options.debugMode)
              {
                switch (front.objective.type)
                {
                  case "discovery":
                  {
                    containerGfx.lineStyle(5, 0xFF0000, 1);
                    break;
                  }
                  case "scoutingPerimeter":
                  {
                    containerGfx.lineStyle(5, 0x0000FF, 1);
                    break;
                  }
                }
              }
              // end debug
              containerGfx.beginFill(color, fillAlpha);
              containerGfx.drawRect(0, 0, text.width+4, text.height);
              containerGfx.endFill();


              fleetContainer.addChild(containerGfx);
              fleetContainer.addChild(text);
              text.x += 2;
              text.y -= 1;
              
              fleetContainer.interactive = true;
              
              var boundMouseDownFN = mouseDownFN.bind(fleet);
              var boundFleetClickFN = fleetClickFn.bind(fleet);
              fleetContainer.on("click", boundFleetClickFN);
              fleetContainer.on("tap", boundFleetClickFN);
              fleetContainer.on("mousedown", boundMouseDownFN);
              fleetContainer.on("mouseup", mouseUpFN);
              fleetContainer.on("rightdown", boundMouseDownFN);
              fleetContainer.on("rightup", mouseUpFN);
              fleetContainer.on("mouseover", mouseOverFN.bind(fleetContainer, fleet));

              return fleetContainer;
            }

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              var fleets = star.getAllFleets();
              if (!fleets || fleets.length <= 0) continue;

              var fleetsContainer = new PIXI.Container();
              fleetsContainer.x = star.x;
              fleetsContainer.y = star.y - 40;

              for (var j = 0; j < fleets.length; j++)
              {
                if (fleets[j].units.length === 0)
                {
                  continue;
                }
                if (fleets[j].isStealthy && this.player && !this.player.starIsDetected(fleets[j].location))
                {
                  continue;
                }
                var drawnFleet = singleFleetDrawFN(fleets[j]);
                drawnFleet.position.x = fleetsContainer.width;
                fleetsContainer.addChild(drawnFleet);
              }

              if (fleetsContainer.children.length > 0)
              {
                fleetsContainer.x -= fleetsContainer.width / 2;
                doc.addChild(fleetsContainer);
              }
            }

            return doc;
          }
        }
        export var debugSectors: IMapRendererLayerTemplate =
        {
          key: "debugSectors",
          displayName: "Sectors (debug)",
          interactive: false,
          alpha: 0.5,
          drawingFunction: function(map: GalaxyMap)
          {
            var doc = new PIXI.Container();
            var points: Star[];
            if (!this.player)
            {
              points = map.stars;
            }
            else
            {
              points = this.player.getRevealedStars();
            }

            if (!points[0].mapGenData || !points[0].mapGenData.sector)
            {
              return doc;
            }

            var sectorIds:
            {
              [id: number]: boolean;
            } = {};

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];
              if (star.mapGenData && star.mapGenData.sector)
              {
                sectorIds[star.mapGenData.sector.id] = true;
              }
            }
            var sectorsCount = Object.keys(sectorIds).length;

            for (var i = 0; i < points.length; i++)
            {
              var star = points[i];

              var sector = star.mapGenData.sector;
              var hue = sector.id / sectorsCount;
              var color = hslToHex(hue, 0.8, 0.5);

              var poly = new PIXI.Polygon(star.voronoiCell.vertices);
              var gfx = new PIXI.Graphics();
              gfx.beginFill(color, 1);
              gfx.drawShape(poly);
              gfx.endFill();
              doc.addChild(gfx);
            }
            return doc;
          }
        }
      }
    }
  }
}
