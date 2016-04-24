/// <reference path="../../../lib/pixi.d.ts" />

import Color from "../../../src/Color";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";

const debugSectors: MapRendererLayerTemplate =
{
  key: "debugSectors",
  displayName: "Sectors (debug)",
  interactive: false,
  alpha: 0.5,
  drawingFunction: function(map: GalaxyMap, persectivePlayer: Player)
  {
    var doc = new PIXI.Container();
    var points: Star[];
    if (!persectivePlayer)
    {
      points = map.stars;
    }
    else
    {
      points = persectivePlayer.getRevealedStars();
    }

    if (!points[0].mapGenData || !points[0].mapGenData.sector)
    {
      return doc;
    }

    var sectorIds:
    {
      [id: number]: boolean;
    } = {};

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];
      if (star.mapGenData && star.mapGenData.sector)
      {
        sectorIds[star.mapGenData.sector.id] = true;
      }
    }
    var sectorsCount = Object.keys(sectorIds).length;

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];

      var sector = star.mapGenData.sector;
      var hue = sector.id / sectorsCount;
      var color = Color.fromHSL(hue, 0.8, 0.5).getHex();

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

export default debugSectors;
