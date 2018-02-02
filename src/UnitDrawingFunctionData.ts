/// <reference path="../lib/pixi.d.ts" />

import Point from "./Point";


function mirrorRectangle(rect: PIXI.Rectangle, midX: number): PIXI.Rectangle
{
  return new PIXI.Rectangle(
    getMirroredPosition(rect.x, midX) - rect.width,
    rect.y,
    rect.width,
    rect.height,
  );
}
function mirrorPoint(point: Point, midX: number): Point
{
  return {x: getMirroredPosition(point.x, midX), y: point.y};
}
function getMirroredPosition(pos: number, mid: number): number
{
  return pos - (pos - mid) * 2;
}
function offsetRectangle(rect: PIXI.Rectangle, offset: Point): PIXI.Rectangle
{
  return new PIXI.Rectangle(
    rect.x + offset.x,
    rect.y + offset.y,
    rect.width,
    rect.height,
  );
}
function offsetPoint(point: Point, offset: Point): Point
{
  return(
  {
    x: point.x + offset.x,
    y: point.y + offset.y,
  });
}

export default class UnitDrawingFunctionData
{
  public boundingBox: PIXI.Rectangle;
  public individualUnitBoundingBoxes: PIXI.Rectangle[];
  public singleAttackOriginPoint: Point;
  public sequentialAttackOriginPoints: Point[];

  constructor(props:
  {
    boundingBox: PIXI.Rectangle;
    individualUnitBoundingBoxes: PIXI.Rectangle[];
    singleAttackOriginPoint: Point;
    sequentialAttackOriginPoints: Point[];
  })
  {
    this.boundingBox = props.boundingBox;
    this.individualUnitBoundingBoxes = props.individualUnitBoundingBoxes;
    this.singleAttackOriginPoint = props.singleAttackOriginPoint;
    this.sequentialAttackOriginPoints = props.sequentialAttackOriginPoints;
  }

  public normalizeForBattleSFX(offset: Point, sceneWidth: number, side: "user" | "target"): UnitDrawingFunctionData
  {
    const cloned = this.clone();
    const padding = 25;  // TODO 2017.06.19 | as defined in src/battlescenunit
    cloned.offset({x: padding, y: offset.y});

    if (side === "target")
    {
      cloned.mirror(sceneWidth / 2);
    }

    return cloned;
  }
  public clone(): UnitDrawingFunctionData
  {
    return new UnitDrawingFunctionData(
    {
      boundingBox: this.boundingBox.clone(),
      individualUnitBoundingBoxes: this.individualUnitBoundingBoxes.map(bbox =>
      {
        return bbox.clone();
      }),
      singleAttackOriginPoint: {x: this.singleAttackOriginPoint.x, y: this.singleAttackOriginPoint.y},
      sequentialAttackOriginPoints: this.sequentialAttackOriginPoints.map(point =>
      {
        return {x: point.x, y: point.y};
      }),
    });
  }
  public offset(offset: Point): UnitDrawingFunctionData
  {
    this.boundingBox = offsetRectangle(this.boundingBox, offset);
    this.individualUnitBoundingBoxes = this.individualUnitBoundingBoxes.map(bbox =>
    {
      return offsetRectangle(bbox, offset);
    });
    this.singleAttackOriginPoint = offsetPoint(this.singleAttackOriginPoint, offset);
    this.sequentialAttackOriginPoints = this.sequentialAttackOriginPoints.map(point =>
    {
      return offsetPoint(point, offset);
    });

    return this;
  }
  public mirror(midX: number): UnitDrawingFunctionData
  {
    this.boundingBox = mirrorRectangle(this.boundingBox, midX);
    this.individualUnitBoundingBoxes = this.individualUnitBoundingBoxes.map(bbox =>
    {
      return mirrorRectangle(bbox, midX);
    });
    this.singleAttackOriginPoint = mirrorPoint(this.singleAttackOriginPoint, midX);
    this.sequentialAttackOriginPoints = this.sequentialAttackOriginPoints.map(point =>
    {
      return mirrorPoint(point, midX);
    });

    return this;
  }
}
