/// <reference path="../../../lib/pixi.d.ts" />

import app from "../../../src/App";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import
{
  generateTextureWithBounds,
  makePolygonFromPoints,
} from "../../../src/utility";

const fogOfWar: MapRendererLayerTemplate =
{
  key: "fogOfWar",
  displayName: "Fog of war",
  interactive: false,
  alpha: 0.35,
  destroy: function()
  {
    for (let starId in fogOfWarSpriteByStarID)
    {
      fogOfWarSpriteByStarID[starId].renderable = false;
      fogOfWarSpriteByStarID[starId].texture.destroy(true);
      fogOfWarSpriteByStarID[starId] = null;
      delete fogOfWarSpriteByStarID[starId];
    }
  },
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
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

let fogOfWarTilingSprite: PIXI.extras.TilingSprite;
function getfogOfWarTilingSprite(width: number, height: number)
{
  if (!fogOfWarTilingSprite)
  {
    const fowTexture = PIXI.Texture.fromFrame("modules/defaultmapmodes/img/fowTexture.png");
    fogOfWarTilingSprite = new PIXI.extras.TilingSprite(fowTexture, width, height);
  }

  return fogOfWarTilingSprite;
}

const fogOfWarSpriteByStarID:
{
  [starId: number]: PIXI.Sprite;
} = {};
function getFogOfWarSpriteForStar(star: Star, width: number, height: number)
{
  const tiled = getfogOfWarTilingSprite(width, height);
  // silly hack to make sure first texture gets created properly
  if (!fogOfWarSpriteByStarID[star.id] || Object.keys(fogOfWarSpriteByStarID).length < 4)
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
    // TODO 02.11.2016 | PIXI4 | still relevant?
    const bounds = tiled.getBounds();

    const rendered = generateTextureWithBounds(app.renderer.renderer, tiled, PIXI.settings.SCALE_MODE, 1, bounds);

    const sprite = new PIXI.Sprite(rendered);

    fogOfWarSpriteByStarID[star.id] = sprite;
    tiled.mask = null;
  }

  return fogOfWarSpriteByStarID[star.id];
}
