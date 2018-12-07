import * as PIXI from "pixi.js";

import Player from "../../../../src/Player";
import {getRevealedBorderEdges, borderWidth} from "../../../../src/borderPolygon";
import MapRendererLayerTemplate from "../../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../../src/pixiWrapperFunctions";


const ownerBorders: MapRendererLayerTemplate =
{
  key: "ownerBorders",
  displayName: "Owner borders",
  interactive: false,
  isUsedForCameraBounds: true,
  initialAlpha: 0.7,
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();
    if (borderWidth <= 0)
    {
      return doc;
    }

    const revealedStars = perspectivePlayer.getRevealedStars();
    const borderEdges = getRevealedBorderEdges(revealedStars, map.voronoi);

    for (let i = 0; i < borderEdges.length; i++)
    {
      const gfx = new PIXI.Graphics();
      doc.addChild(gfx);
      const polyLineData = borderEdges[i];
      const player: Player = polyLineData.points[0].star.owner;
      gfx.lineStyle(borderWidth, player.secondaryColor.getHex(), 1);

      if (polyLineData.isClosed)
      {
        polyLineData.points.push(polyLineData.points[0]);
      }

      const polygon = makePolygonFromPoints(polyLineData.points);
      polygon.closed = polyLineData.isClosed;
      gfx.drawShape(polygon);
    }

    return doc;
  },
};

export default ownerBorders;
