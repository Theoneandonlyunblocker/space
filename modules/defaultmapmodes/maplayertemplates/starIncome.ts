/// <reference path="../../../lib/pixi.d.ts" />

import Color from "../../../src/Color";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import
{
  makePolygonFromPoints,
} from "../../../src/pixiWrapperFunctions";

const starIncome: MapRendererLayerTemplate =
{
  key: "starIncome",
  displayName: "Income",
  interactive: false,
  isUsedForCameraBounds: true,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    const doc = new PIXI.Container();
    const points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
    const incomeBounds = map.getIncomeBounds();

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
      const income = star.getIncome();
      const relativeIncome = getRelativeValue(incomeBounds.min, incomeBounds.max, income);
      const color = getRelativeColor(incomeBounds.min, incomeBounds.max, relativeIncome);

      const poly = makePolygonFromPoints(star.voronoiCell.vertices);
      const gfx = new PIXI.Graphics();
      gfx.beginFill(color, 0.6);
      gfx.drawShape(poly);
      gfx.endFill();
      doc.addChild(gfx);
    }
    return doc;
  },
};

export default starIncome;
