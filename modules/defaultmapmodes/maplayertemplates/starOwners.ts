/// <reference path="../../../lib/pixi.d.ts" />

import Player from "../../../src/Player";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import MapRenderer from "../../../src/MapRenderer";

import OccupationShader from "./shaders/Occupation";

const starOwners: MapRendererLayerTemplate =
{
  key: "starOwners",
  displayName: "Star owners",
  interactive: false,
  alpha: 0.5,
  destroy: function()
  {
    for (let key in occupationShaders)
    {
      delete occupationShaders[key];
    }
  },
  drawingFunction: function(mapRenderer: MapRenderer, map: GalaxyMap)
  {
    var doc = new PIXI.Container();
    var points: Star[];
    if (!mapRenderer.player)
    {
      points = map.stars;
    }
    else
    {
      points = mapRenderer.player.getRevealedStars();
    }

    for (let i = 0; i < points.length; i++)
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
        gfx.filters = [getOccupationShader(star.owner, occupier)];
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

export default starOwners;

const occupationShaders:
{
  [ownerId: string]:
  {
    [occupierId: string]: OccupationShader;
  };
} = {};

function getOccupationShader(owner: Player, occupier: Player)
{
  if (!occupationShaders[owner.id])
  {
    occupationShaders[owner.id] = {};
  }

  if (!occupationShaders[owner.id][occupier.id])
  {
    occupationShaders[owner.id][occupier.id] = new OccupationShader(
    {
      stripeColor: occupier.color.getRGBA(1.0),
      stripeSize: 0.5,
      offset: [0.0, 0.0],
      angle: 0.25 * Math.PI,
      scale: 8.0
    });
  }

  return occupationShaders[owner.id][occupier.id]
}
function forEachOccupationShader(cb: (shader: OccupationShader) => void)
{
  for (let ownerId in occupationShaders)
  {
    for (let occupierId in occupationShaders[ownerId])
    {
      cb(occupationShaders[ownerId][occupierId]);
    }
  }
}
function updateOccupationShaderOffset(x: number, y: number)
{
  forEachOccupationShader(shader =>
  {
    shader.uniforms.offset.value = [-x, y];
  });
}
function updateShaderZoom(zoom: number)
{
  forEachOccupationShader(shader =>
  {
    shader.uniforms.scale.value = zoom;
  });
}
