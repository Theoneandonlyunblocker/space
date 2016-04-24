/// <reference path="../../../lib/pixi.d.ts" />

import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";

const nonFillerVoronoiLines: MapRendererLayerTemplate =
{
  key: "nonFillerVoronoiLines",
  displayName: "Star borders",
  interactive: false,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();

    var gfx = new PIXI.Graphics();
    doc.addChild(gfx);
    gfx.lineStyle(1, 0xA0A0A0, 0.5);

    var visible = perspectivePlayer ? perspectivePlayer.getRevealedStars() : null;

    var lines = map.voronoi.getNonFillerVoronoiLines(visible);

    for (let i = 0; i < lines.length; i++)
    {
      var line = lines[i];
      gfx.moveTo(line.va.x, line.va.y);
      gfx.lineTo(line.vb.x, line.vb.y);
    }

    return doc;
  }
}

export default nonFillerVoronoiLines;
