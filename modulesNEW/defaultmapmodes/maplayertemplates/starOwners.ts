/// <reference path="../../../lib/pixi.d.ts" />

import Star from "../../../src/Star.ts";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import GalaxyMap from "../../../src/GalaxyMap.ts";


const starOwners: MapRendererLayerTemplate =
{
  key: "starOwners",
  displayName: "Star owners",
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

    for (var i = 0; i < points.length; i++)
    {
      var star = points[i];
      var occupier = star.getSecondaryController();
      if (!star.owner || (!occupier && star.owner.colorAlpha === 0)) continue;

      var poly = new PIXI.Polygon(star.voronoiCell.vertices);
      var gfx = new PIXI.Graphics();
      var alpha = 1;
      if (isFinite(star.owner.colorAlpha)) alpha *= star.owner.colorAlpha;
      gfx.beginFill(star.owner.color.getHex(), alpha);
      gfx.drawShape(poly);
      gfx.endFill();

      if (occupier)
      {
        var container = new PIXI.Container();
        doc.addChild(container);

        var mask = new PIXI.Graphics();
        mask.isMask = true;
        mask.beginFill(0);
        mask.drawShape(poly);
        mask.endFill();

        container.addChild(gfx);
        container.addChild(mask);
        gfx.filters = [this.getOccupationShader(star.owner, occupier)];
        container.mask = mask;
      }
      else
      {
        doc.addChild(gfx);
      }
    }
    return doc;
  }
}

export default MapRendererLayerTemplate;
