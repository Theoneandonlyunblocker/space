import
{
  Clonable,
  Primitive,
  ShallowObject,
} from "./BasePropInfoClasses";
import {PropInfoType} from "./PropInfoType";

import RampingValue from "../RampingValue";

import Color from "../../../../../src/Color";
import Point from "../../../../../src/Point";
import Range from "../../../../../src/Range";

export class BooleanPropInfo extends Primitive<boolean>
{
  public readonly type: PropInfoType.Boolean;
}
export class NumberPropInfo extends Primitive<number>
{
  public readonly type: PropInfoType.Number;
}

export class PointPropInfo extends ShallowObject<Point>
{
  public readonly type: PropInfoType.Point;
}
export class RangePropInfo extends ShallowObject<Range>
{
  public readonly type: PropInfoType.Range;
}

export class ColorPropInfo extends Clonable<Color>
{
  public readonly type: PropInfoType.Color;
}
export class RampingValuePropInfo extends Clonable<RampingValue>
{
  public readonly type: PropInfoType.RampingValue;
}
