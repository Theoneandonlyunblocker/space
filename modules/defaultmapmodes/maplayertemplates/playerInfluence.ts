/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import MapEvaluator from "../../defaultai/mapai/MapEvaluator";

import Color from "../../../src/Color";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";

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
    const doc = new PIXI.Container();
    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;

    const mapEvaluator = new MapEvaluator(map, perspectivePlayer);
    const influenceByStar = mapEvaluator.getPlayerInfluenceMap(perspectivePlayer);

    let minInfluence: number, maxInfluence: number;

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
    });

    function getRelativeValue(min: number, max: number, value: number)
    {
      const difference = Math.max(max - min, 1);
      // clamps to n different colors
      const threshhold = Math.max(difference / 10, 1);
      const relative = (Math.round(value/threshhold) * threshhold - min) / (difference);
      return relative;
    }

    const colorIndexes:
    {
      [value: number]: number;
    } = {};

    function getRelativeColor(min: number, max: number, value: number)
    {
      if (!colorIndexes[value])
      {
        if (value < 0) value = 0;
        else if (value > 1) value = 1;

        const deviation = Math.abs(0.5 - value) * 2;

        const hue = 110 * value;
        const saturation = 0.5 + 0.2 * deviation;
        const lightness = 0.6 + 0.25 * deviation;

        colorIndexes[value] = Color.fromHSL(hue / 360, saturation, lightness / 2).getHex();
      }
      return colorIndexes[value];
    }

    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      const influence = influenceByStar.get(star);

      if (!influence)
      {
        continue;
      }

      const relativeInfluence = getRelativeValue(minInfluence, maxInfluence, influence);
      const color = getRelativeColor(minInfluence, maxInfluence, relativeInfluence);

      const poly = makePolygonFromPoints(star.voronoiCell.vertices);
      const gfx = new PIXI.Graphics();
      gfx.beginFill(color, 0.6);
      gfx.drawShape(poly);
      gfx.endFill;
      doc.addChild(gfx);
    }
    return doc;
  },
};

export default playerInfluence;
