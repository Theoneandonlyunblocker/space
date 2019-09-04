import * as PIXI from "pixi.js";

import {Star} from "../../../../src/map/Star";
import {MapRendererLayerTemplate} from "../../../../src/templateinterfaces/MapRendererLayerTemplate";
import
{
  makePolygonFromPoints,
} from "../../../../src/graphics/pixiWrapperFunctions";

import {resources} from "../resources";
import { localize } from "../localization/localize";


const fogOfWarMeshesByStarId:
{
  [starId: number]: PIXI.TilingSprite;
} = {};


export const fogOfWar: MapRendererLayerTemplate =
{
  key: "fogOfWar",
  get displayName()
  {
    return localize("fogOfWar_displayName").toString();
  },
  interactive: false,
  isUsedForCameraBounds: false,
  initialAlpha: 0.6,
  destroy: () =>
  {
    for (const starId in fogOfWarMeshesByStarId)
    {
      fogOfWarMeshesByStarId[starId].renderable = false;

      delete fogOfWarMeshesByStarId[starId];
    }
  },
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();
    if (perspectivePlayer)
    {
      const starsInFogOfWar = perspectivePlayer.getRevealedButNotVisibleStars();

      starsInFogOfWar.forEach(star =>
      {
        const mesh = getFogOfWarMeshForStar(star);

        doc.addChild(mesh);
      });
    }

    return doc;
  },
};

function getFogOfWarMeshForStar(star: Star): PIXI.TilingSprite
{
  if (!fogOfWarMeshesByStarId[star.id])
  {
    fogOfWarMeshesByStarId[star.id] = makeFogOfWarMeshForStar(star);
  }

  return fogOfWarMeshesByStarId[star.id]!;
}
function makeFogOfWarMeshForStar(star: Star): PIXI.TilingSprite
{
  const bbox = star.voronoiCell.getBbox();

  const sprite = new PIXI.TilingSprite(
    resources.fogOfWarTexture,
    bbox.width,
    bbox.height,
  );
  sprite.position.set(bbox.x, bbox.y);
  sprite.tilePosition.set(-bbox.x, -bbox.y);

  const gfx = new PIXI.Graphics();
  gfx.beginFill(0xff0000, 1);
  gfx.drawShape(makePolygonFromPoints(star.voronoiCell.vertices));
  gfx.endFill();
  gfx.position.set(-bbox.x, -bbox.y);

  sprite.addChild(gfx);
  sprite.mask = gfx;

  return sprite;
}
