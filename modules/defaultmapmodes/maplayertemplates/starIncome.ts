/// <reference path="../../../lib/pixi.d.ts" />

import Color from "../../../src/Color";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../src/utility";

const starIncome: MapRendererLayerTemplate =
{
  key: "starIncome",
  displayName: "Income",
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
    var incomeBounds = map.getIncomeBounds();

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
      var income = star.getIncome();
      var relativeIncome = getRelativeValue(incomeBounds.min, incomeBounds.max, income);
      var color = getRelativeColor(incomeBounds.min, incomeBounds.max, relativeIncome);

      var poly = makePolygonFromPoints(star.voronoiCell.vertices);
      var gfx = new PIXI.Graphics();
      gfx.beginFill(color, 0.6);
      gfx.drawShape(poly);
      gfx.endFill();
      doc.addChild(gfx);
    }
    return doc;
  },
}

export default starIncome;
