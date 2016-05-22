/// <reference path="../../lib/pixi.d.ts" />

import Point from "../Point";

declare interface UnitDrawingFunctionData
{
  boundingBox: PIXI.Rectangle;
  individualUnitBoundingBoxes: PIXI.Rectangle[];
  singleAttackOriginPoint: Point;
  sequentialAttackOriginPoints: Point[];
}

export default UnitDrawingFunctionData;
