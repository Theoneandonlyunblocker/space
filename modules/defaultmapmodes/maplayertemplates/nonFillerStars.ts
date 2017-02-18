/// <reference path="../../../lib/pixi.d.ts" />

import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import eventManager from "../../../src/eventManager";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../src/utility";

const nonFillerStars: MapRendererLayerTemplate =
{
  key: "nonFillerStars",
  displayName: "Stars",
  interactive: true,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    const doc = new PIXI.Container();

    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    const mouseDownFN = function(star: Star, event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("mouseDown", event, star);
    };
    const mouseUpFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("mouseUp", event);
    };
    const onClickFN = function(star: Star)
    {
      eventManager.dispatchEvent("starClick", star);
    };
    const mouseOverFN = function(star: Star)
    {
      eventManager.dispatchEvent("hoverStar", star);
    };
    const mouseOutFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("clearHover");
    };
    const touchStartFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("touchStart", event);
    };
    const touchEndFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("touchEnd", event);
    };
    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      let starSize = 1;
      if (star.buildings["defence"])
      {
        starSize += star.buildings["defence"].length * 2;
      }
      const gfx = new PIXI.Graphics();
      if (!star.owner.isIndependent)
      {
        gfx.lineStyle(starSize / 2, star.owner.color.getHex(), 1);
      }
      gfx.beginFill(0xFFFFF0);
      gfx.drawCircle(star.x, star.y, starSize);
      gfx.endFill();


      gfx.interactive = true;
      gfx.hitArea = makePolygonFromPoints(star.voronoiCell.vertices);

      const boundMouseDown = mouseDownFN.bind(null, star);
      const gfxClickFN = function(star: Star, event: PIXI.interaction.InteractionEvent)
      {
        const originalEvent = <MouseEvent> event.data.originalEvent;
        if (originalEvent.button) return;

        onClickFN(star);
      }.bind(null, star);

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
      const local = event.data.getLocalPosition(doc);
      const starAtLocal = map.voronoi.getStarAtPoint(local);
      if (starAtLocal)
      {
        eventManager.dispatchEvent("hoverStar", starAtLocal);
      }
    });

    return doc;
  },
};

export default nonFillerStars;
