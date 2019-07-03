import * as PIXI from "pixi.js";

import {app} from "../../../../src/App";
import Star from "../../../../src/Star";
import MapRendererLayerTemplate from "../../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  generateTextureWithBounds,
  makePolygonFromPoints,
} from "../../../../src/pixiWrapperFunctions";

import {resources} from "../resources";


const fogOfWarSpriteByStarId:
{
  [starId: number]: PIXI.Sprite;
} = {};


const fogOfWar: MapRendererLayerTemplate =
{
  key: "fogOfWar",
  displayName: "Fog of war",
  interactive: false,
  isUsedForCameraBounds: false,
  initialAlpha: 0.35,
  destroy: () =>
  {
    for (const starId in fogOfWarSpriteByStarId)
    {
      fogOfWarSpriteByStarId[starId].renderable = false;
      fogOfWarSpriteByStarId[starId].texture.destroy(true);
      delete fogOfWarSpriteByStarId[starId];
    }
  },
  drawingFunction: (map, perspectivePlayer) =>
  {
    const doc = new PIXI.Container();
    if (perspectivePlayer)
    {
      const starsInFogOfWar: Star[] = perspectivePlayer.getRevealedButNotVisibleStars();

      for (let i = 0; i < starsInFogOfWar.length; i++)
      {
        const star = starsInFogOfWar[i];
        const sprite = getFogOfWarSpriteForStar(star, map.width, map.height);

        doc.addChild(sprite);
      }
    }

    return doc;
  },
};

export default fogOfWar;

let fogOfWarTilingSprite: PIXI.TilingSprite;
function getfogOfWarTilingSprite(width: number, height: number)
{
  if (!fogOfWarTilingSprite)
  {
    const fowTexture = resources.fogOfWarTexture;
    fogOfWarTilingSprite = new PIXI.TilingSprite(fowTexture, width, height);
  }

  return fogOfWarTilingSprite;
}

function getFogOfWarSpriteForStar(star: Star, width: number, height: number): PIXI.Sprite
{
  const tiled = getfogOfWarTilingSprite(width, height);
  // silly hack to make sure first texture gets created properly
  if (!fogOfWarSpriteByStarId[star.id] || Object.keys(fogOfWarSpriteByStarId).length < 4)
  {
    const poly = makePolygonFromPoints(star.voronoiCell.vertices);
    const gfx = new PIXI.Graphics();
    gfx.isMask = true;
    gfx.beginFill(0);
    gfx.drawShape(poly);
    gfx.endFill();

    tiled.removeChildren();

    tiled.mask = gfx;
    tiled.addChild(gfx);

    // triggers bounds update that gets skipped if we just call generateTexture()
    // TODO 2016.11.02 | PIXI4 | still relevant?
    const bounds = tiled.getBounds();

    const rendered = generateTextureWithBounds(app.renderer.renderer, tiled, PIXI.settings.SCALE_MODE, 1, bounds);

    const sprite = new PIXI.Sprite(rendered);

    fogOfWarSpriteByStarId[star.id] = sprite;
    tiled.mask = null;
  }

  return fogOfWarSpriteByStarId[star.id]!;
}
