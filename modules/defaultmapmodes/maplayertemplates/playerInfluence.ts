/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import MapEvaluator from "../../defaultai/mapai/MapEvaluator";

import Color from "../../../src/Color";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";

import
{
  makePolygonFromPoints,
} from "../../../src/utility";

const playerInfluence: MapRendererLayerTemplate =
{
  key: "playerInfluence",
  displayName: "Influence",
  interactive: false,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();
    var points: Star[];
    if (!perspectivePlayer)
    {
      points = map.stars;
    }
    else
    {
      points = perspectivePlayer.getRevealedStars();
    }
    var mapEvaluator = new MapEvaluator(map, perspectivePlayer);
    var influenceByStar = mapEvaluator.getPlayerInfluenceMap(perspectivePlayer);

    var minInfluence: number, maxInfluence: number;

    influenceByStar.forEach((star, influence) =>
    {
      if (!isFinite(minInfluence) || influence < minInfluence)
      {
        minInfluence = influence;
      }
      if (!isFinite(maxInfluence) || influence > maxInfluence)
      {
        maxInfluence = influence;
      }
    })

    function getRelativeValue(min: number, max: number, value: number)
    {
      var difference = max - min;
      if (difference < 1) difference = 1;
      // clamps to n different colors
      var threshhold = difference / 10;
      if (threshhold < 1) threshhold = 1;
      var relative = (Math.round(value/threshhold) * threshhold - min) / (difference);
      return relative;
    }

    var colorIndexes:
    {
      [value: number]: number;
    } = {};

    function getRelativeColor(min: number, max: number, value: number)
    {
      if (!colorIndexes[value])
      {
        if (value < 0) value = 0;
        else if (value > 1) value = 1;

        var deviation = Math.abs(0.5 - value) * 2;

        var hue = 110 * value;
        var saturation = 0.5 + 0.2 * deviation;
        var lightness = 0.6 + 0.25 * deviation;

        colorIndexes[value] = Color.fromHSL(hue / 360, saturation, lightness / 2).getHex();
      }
      return colorIndexes[value];
    }

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];
      const influence = influenceByStar.get(star);

      if (!influence)
      {
        continue;
      }

      var relativeInfluence = getRelativeValue(minInfluence, maxInfluence, influence);
      var color = getRelativeColor(minInfluence, maxInfluence, relativeInfluence);

      var poly = makePolygonFromPoints(star.voronoiCell.vertices);
      var gfx = new PIXI.Graphics();
      gfx.beginFill(color, 0.6);
      gfx.drawShape(poly);
      gfx.endFill;
      doc.addChild(gfx);
    }
    return doc;
  }
}

export default playerInfluence;
