import * as PIXI from "pixi.js";

import {MapRendererLayerTemplate} from "core/src/templateinterfaces/MapRendererLayerTemplate";
import { localize } from "../localization/localize";


export const resources: MapRendererLayerTemplate =
{
  key: "resources",
  get displayName()
  {
    return localize("resources_displayName").toString();
  },
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
