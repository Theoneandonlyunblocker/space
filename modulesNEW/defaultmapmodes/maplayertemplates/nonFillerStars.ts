/// <reference path="../../../lib/pixi.d.ts" />

import eventManager from "../../../src/eventManager.ts";
import Star from "../../../src/Star.ts";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import GalaxyMap from "../../../src/GalaxyMap.ts";


const nonFillerStars: MapRendererLayerTemplate =
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
        gfx.lineStyle(starSize / 2, star.owner.color.getHex(), 1);
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

export default nonFillerStars;


export default MapRendererLayerTemplate;
