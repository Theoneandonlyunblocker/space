// TODO performance | rework occupation
// probably generate texture for tiling sprite + use masks

import * as PIXI from "pixi.js";

import {Player} from "../../../../src/Player";
import {eventManager} from "../../../../src/eventManager";
import {MapRendererLayerTemplate} from "../../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../../src/pixiWrapperFunctions";

import {Occupation as OccupationShader} from "./shaders/Occupation";


export const starOwners: MapRendererLayerTemplate =
{
  key: "starOwners",
  displayName: "Star owners",
  interactive: false,
  isUsedForCameraBounds: true,
  initialAlpha: 0.5,
  destroy: () =>
  {
    for (const key in occupationShaders)
    {
      delete occupationShaders[key];
    }
  },
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();
    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      const occupier = star.getSecondaryController();
      if (!star.owner || (!occupier && star.owner.colorAlpha === 0))
      {
        continue;
      }

      const poly = makePolygonFromPoints(star.voronoiCell.vertices);
      const gfx = new PIXI.Graphics();
      let alpha = 1;
      if (isFinite(star.owner.colorAlpha))
      {
        alpha *= star.owner.colorAlpha;
      }
      gfx.beginFill(star.owner.color.getHex(), alpha);
      gfx.drawShape(poly);
      gfx.endFill();

      if (occupier)
      {
        // const container = new PIXI.Container();
        // doc.addChild(container);

        // const mask = new PIXI.Graphics();
        // mask.isMask = true;
        // mask.beginFill(0);
        // mask.drawShape(poly);
        // mask.endFill();

        // container.addChild(gfx);
        // container.addChild(mask);
        // container.mask = mask;
        gfx.filters = [getOccupationShader(star.owner, occupier)];
      }

      doc.addChild(gfx);
    }

    return doc;
  },
};

const occupationShaders:
{
  [ownerId: string]:
  {
    [occupierId: string]: OccupationShader;
  };
} = {};

const hasAddedEventListeners = false;
function getOccupationShader(owner: Player, occupier: Player)
{
  if (!hasAddedEventListeners)
  {
    eventManager.addEventListener("cameraZoomed", updateShaderZoom);
    eventManager.addEventListener("cameraMoved", updateShaderOffset);
  }
  if (!occupationShaders[owner.id])
  {
    occupationShaders[owner.id] = {};
  }

  if (!occupationShaders[owner.id][occupier.id])
  {
    occupationShaders[owner.id][occupier.id] = new OccupationShader(
    {
      stripeColor: occupier.color.getRGBA(1.0),
      stripeSize: 0.33,
      offset: [0.0, 0.0],
      angle: 0.25 * Math.PI,
      scale: 8.0,
    });
  }

  return occupationShaders[owner.id][occupier.id];
}
function forEachOccupationShader(cb: (shader: OccupationShader) => void)
{
  for (const ownerId in occupationShaders)
  {
    for (const occupierId in occupationShaders[ownerId])
    {
      cb(occupationShaders[ownerId][occupierId]);
    }
  }
}
function updateShaderOffset(x: number, y: number)
{
  forEachOccupationShader(shader =>
  {
    shader.uniforms.offset = [-x, y];
  });
}
function updateShaderZoom(zoom: number)
{
  forEachOccupationShader(shader =>
  {
    shader.uniforms.scale = zoom * 8.0;
  });
}
