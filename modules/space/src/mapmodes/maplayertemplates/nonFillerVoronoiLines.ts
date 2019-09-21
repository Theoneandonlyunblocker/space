import * as PIXI from "pixi.js";

import {MapRendererLayerTemplate} from "core/src/templateinterfaces/MapRendererLayerTemplate";
import { localize } from "modules/space/localization/localize";


export const nonFillerVoronoiLines: MapRendererLayerTemplate =
{
  key: "nonFillerVoronoiLines",
  get displayName()
  {
    return localize("nonFillerVoronoiLines_displayName").toString();
  },
  interactive: false,
  isUsedForCameraBounds: true,
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();

    const gfx = new PIXI.Graphics();
    doc.addChild(gfx);
    gfx.lineStyle(1, 0xA0A0A0, 0.5);

    const visible = perspectivePlayer ? perspectivePlayer.getRevealedStars() : null;

    const lines = map.voronoi.getNonFillerVoronoiLines(visible);

    for (let i = 0; i < lines.length; i++)
    {
      const line = lines[i];
      gfx.moveTo(line.va.x, line.va.y);
      gfx.lineTo(line.vb.x, line.vb.y);
    }

    return doc;
  },
};
