/// <reference path="../../../lib/pixi.d.ts" />

import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

const resources: MapRendererLayerTemplate =
{
  key: "resources",
  displayName: "Resources",
  interactive: false,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();

    var points: Star[];
    if (!perspectivePlayer)
    {
      points = map.stars;
    }
    else
    {
      points = perspectivePlayer.getRevealedStars();
    }

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];
      if (!star.resource) continue;

      var text = new PIXI.Text(star.resource.displayName,
      {
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
      });

      text.x = star.x;
      text.x -= text.width / 2;
      text.y = star.y + 8;

      doc.addChild(text);
    }

    return doc;
  },
};

export default resources;
