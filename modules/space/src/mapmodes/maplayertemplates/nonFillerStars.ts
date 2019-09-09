import * as PIXI from "pixi.js";

import {Star} from "core/src/map/Star";
import {eventManager} from "core/src/app/eventManager";
import {MapRendererLayerTemplate} from "core/src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "core/src/graphics/pixiWrapperFunctions";
import { localize } from "../localization/localize";


export const nonFillerStars: MapRendererLayerTemplate =
{
  key: "nonFillerStars",
  get displayName()
  {
    return localize("nonFillerStars_displayName").toString();
  },
  interactive: true,
  isUsedForCameraBounds: false,
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();

    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    const onClickFN = (star: Star) =>
    {
      eventManager.dispatchEvent("starClick", star);
    };
    const mouseOverFN = (star: Star) =>
    {
      eventManager.dispatchEvent("hoverStar", star);
    };
    const mouseOutFN = (event: PIXI.interaction.InteractionEvent) =>
    {
      eventManager.dispatchEvent("clearHover");
    };
    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      const territoryBuildingsCount = star.territoryBuildings.length;

      const starSize = 1 + territoryBuildingsCount * 2;

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

      const gfxClickFN = (event: PIXI.interaction.InteractionEvent) =>
      {
        const originalEvent = <MouseEvent> event.data.originalEvent;
        if (originalEvent.button) { return; }

        onClickFN(star);
      };

      gfx.on("click", gfxClickFN);
      gfx.on("mouseover", mouseOverFN.bind(gfx, star));
      gfx.on("mouseout", mouseOutFN);
      gfx.on("tap", gfxClickFN);

      doc.addChild(gfx);
    }

    doc.interactive = true;

    // cant be set on gfx as touchmove and touchend only register
    // on the object that had touchstart called on it
    doc.on("touchmove", (event: PIXI.interaction.InteractionEvent) =>
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
