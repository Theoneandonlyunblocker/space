/// <reference path="../../../lib/pixi.d.ts" />

import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";

const fogOfWar: MapRendererLayerTemplate =
{
  key: "fogOfWar",
  displayName: "Fog of war",
  interactive: false,
  alpha: 0.35,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();
    if (perspectivePlayer)
    {
      var starsInFogOfWar: Star[] = perspectivePlayer.getRevealedButNotVisibleStars();

      for (let i = 0; i < starsInFogOfWar.length; i++)
      {
        var star = starsInFogOfWar[i];
        var sprite = getFowSpriteForStar(star); // TODO layers

        doc.addChild(sprite);
      }
    }

    return doc;
  }
}

export default fogOfWar;
