// TODO 2019.07.23 | rework

import * as PIXI from "pixi.js";

import {Player} from "../../../../src/player/Player";
import {eventManager} from "../../../../src/app/eventManager";
import {MapRendererLayerTemplate} from "../../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../../src/graphics/pixiWrapperFunctions";

import {OccupationFilter} from "./shaders/OccupationFilter";


export const starOwners: MapRendererLayerTemplate =
{
  key: "starOwners",
  displayName: "Star owners",
  interactive: false,
  isUsedForCameraBounds: true,
  initialAlpha: 0.5,
  destroy: () =>
  {
    for (const key in occupationFilters)
    {
      delete occupationFilters[key];
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
        const container = new PIXI.Container();
        doc.addChild(container);

        const mask = new PIXI.Graphics();
        // TODO 2019.07.23 | what's this?
        // mask.isMask = true;
        mask.beginFill(0);
        mask.drawShape(poly);
        mask.endFill();

        container.addChild(gfx);
        container.addChild(mask);
        container.mask = mask;
        gfx.filters = [getOccupationFilter(star.owner, occupier)];
      }

      doc.addChild(gfx);
    }

    return doc;
  },
};

const occupationFilters:
{
  [ownerId: string]:
  {
    [occupierId: string]: OccupationFilter;
  };
} = {};

const hasAddedEventListeners = false;

function getOccupationFilter(owner: Player, occupier: Player)
{
  if (!hasAddedEventListeners)
  {
    eventManager.addEventListener("cameraZoomed", updateFilterZoom);
    eventManager.addEventListener("cameraMoved", updateFilterOffset);
  }
  if (!occupationFilters[owner.id])
  {
    occupationFilters[owner.id] = {};
  }

  if (!occupationFilters[owner.id][occupier.id])
  {
    occupationFilters[owner.id][occupier.id] = new OccupationFilter(
    {
      stripeColor: occupier.color.getRGBA(1.0),
      stripeSize: 0.33,
      offset: [0.0, 0.0],
      angle: 0.25 * Math.PI,
      scale: 8.0,
    });
  }

  return occupationFilters[owner.id][occupier.id];
}
function forEachOccupationFilter(cb: (filter: OccupationFilter) => void)
{
  for (const ownerId in occupationFilters)
  {
    for (const occupierId in occupationFilters[ownerId])
    {
      cb(occupationFilters[ownerId][occupierId]);
    }
  }
}
function updateFilterOffset(x: number, y: number)
{
  forEachOccupationFilter(filter =>
  {
    filter.uniforms.offset = [-x, y];
  });
}
function updateFilterZoom(zoom: number)
{
  forEachOccupationFilter(filter =>
  {
    filter.uniforms.scale = zoom * 8.0;
  });
}
