/// <reference path="../../../lib/pixi.d.ts" />

import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

const starLinks: MapRendererLayerTemplate =
{
  key: "starLinks",
  displayName: "Links",
  interactive: false,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();

    var gfx = new PIXI.Graphics();
    doc.addChild(gfx);
    gfx.lineStyle(1, 0xCCCCCC, 0.6);

    var points: Star[];
    if (!perspectivePlayer)
    {
      points = map.stars;
    }
    else
    {
      points = perspectivePlayer.getRevealedStars();
    }

    var starsFullyConnected:
    {
      [id: number]: boolean;
    } = {};

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];
      if (starsFullyConnected[star.id]) continue;

      starsFullyConnected[star.id] = true;

      for (let j = 0; j < star.linksTo.length; j++)
      {
        gfx.moveTo(star.x, star.y);
        gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
      }
      for (let j = 0; j < star.linksFrom.length; j++)
      {
        gfx.moveTo(star.linksFrom[j].x, star.linksFrom[j].y);
        gfx.lineTo(star.x, star.y);
      }
    }
    return doc;
  }
}

export default starLinks;
