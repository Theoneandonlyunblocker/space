/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";


const resources: MapRendererLayerTemplate =
{
  key: "resources",
  displayName: "Resources",
  interactive: false,
  isUsedForCameraBounds: false,
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();

    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      if (!star.resource) { continue; }

      const text = new PIXI.Text(star.resource.displayName,
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
