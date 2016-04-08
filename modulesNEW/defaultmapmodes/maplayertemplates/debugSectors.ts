/// <reference path="../../../lib/pixi.d.ts" />

import Color from "../../../src/Color.ts";
import Star from "../../../src/Star.ts";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import GalaxyMap from "../../../src/GalaxyMap.ts";


const debugSectors: MapRendererLayerTemplate =
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