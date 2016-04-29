/// <reference path="../../../lib/pixi.d.ts" />

import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import app from "../../../src/App";

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
    var doc = new PIXI.Container();
    if (perspectivePlayer)
    {
      var starsInFogOfWar: Star[] = perspectivePlayer.getRevealedButNotVisibleStars();

      for (let i = 0; i < starsInFogOfWar.length; i++)
      {
        var star = starsInFogOfWar[i];
        var sprite = getFogOfWarSpriteForStar(star, map.width, map.height);

        doc.addChild(sprite);
      }
    }

    return doc;
  }
}

export default fogOfWar;

let fogOfWarTilingSprite: PIXI.extras.TilingSprite;
function getfogOfWarTilingSprite(width: number, height: number)
{
  if (!fogOfWarTilingSprite)
  {
    var fowTexture = PIXI.Texture.fromFrame("modules/defaultmapmodes/img/fowTexture.png");
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
    var poly = new PIXI.Polygon(<PIXI.Point[]> star.voronoiCell.vertices);
    var gfx = new PIXI.Graphics();
    gfx.isMask = true;
    gfx.beginFill(0);
    gfx.drawShape(poly);
    gfx.endFill();

    tiled.removeChildren();

    tiled.mask = gfx;
    tiled.addChild(gfx);

    // triggers bounds update that gets skipped if we just call generateTexture()
    var bounds = tiled.getBounds();

    var rendered = tiled.generateTexture(app.renderer.renderer, PIXI.SCALE_MODES.DEFAULT, 1, bounds);

    var sprite = new PIXI.Sprite(rendered);

    fogOfWarSpriteByStarID[star.id] = sprite;
    tiled.mask = null;
  }

  return fogOfWarSpriteByStarID[star.id];
}
