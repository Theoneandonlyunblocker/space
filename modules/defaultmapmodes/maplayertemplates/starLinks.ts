/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";


const starLinks: MapRendererLayerTemplate =
{
  key: "starLinks",
  displayName: "Links",
  interactive: false,
  isUsedForCameraBounds: false,
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();

    const gfx = new PIXI.Graphics();
    doc.addChild(gfx);
    gfx.lineStyle(1, 0xCCCCCC, 0.6);

    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    const starsFullyConnected:
    {
      [id: number]: boolean;
    } = {};

    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
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
  },
};

export default starLinks;
