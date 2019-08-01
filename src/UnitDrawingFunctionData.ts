import * as PIXI from "pixi.js";

import {Point} from "./Point";


function mirrorRectangle(rect: PIXI.Rectangle, midX: number): void
{
  rect.x = getMirroredPosition(rect.x, midX) - rect.width;
}
function mirrorPoint(point: Point, midX: number): void
{
  point.x = getMirroredPosition(point.x, midX);
}
function getMirroredPosition(pos: number, mid: number): number
{
  return pos - (pos - mid) * 2;
}
function offsetRectangle(rect: PIXI.Rectangle, offset: Point): void
{
  rect.x += offset.x;
  rect.y += offset.y;
}
function offsetPoint(point: Point, offset: Point): void
{
  point.x += offset.x;
  point.y += offset.y;
}

export class UnitDrawingFunctionData
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

  public normalizeForBattleVfx(offset: Point, sceneWidth: number, side: "user" | "target"): UnitDrawingFunctionData
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

  private clone(): UnitDrawingFunctionData
  {
    return new UnitDrawingFunctionData(
    {
      boundingBox: this.boundingBox.clone(),
      individualUnitBoundingBoxes: this.individualUnitBoundingBoxes.map(bBox =>
      {
        return bBox.clone();
      }),

      singleAttackOriginPoint: {x: this.singleAttackOriginPoint.x, y: this.singleAttackOriginPoint.y},
      sequentialAttackOriginPoints: this.sequentialAttackOriginPoints.map(point =>
      {
        return {x: point.x, y: point.y};
      }),
    });
  }
  private offset(offset: Point): void
  {
    offsetRectangle(this.boundingBox, offset);
    this.individualUnitBoundingBoxes.forEach(bBox => offsetRectangle(bBox, offset));

    offsetPoint(this.singleAttackOriginPoint, offset);
    this.sequentialAttackOriginPoints.forEach(point => offsetPoint(point, offset));

    {
    });
  }
  private mirror(midX: number): void
  {
    mirrorRectangle(this.boundingBox, midX);
    this.individualUnitBoundingBoxes.forEach(bBox => mirrorRectangle(bBox, midX));
    mirrorPoint(this.singleAttackOriginPoint, midX);
    this.sequentialAttackOriginPoints.forEach(point => mirrorPoint(point, midX));
  }
}
