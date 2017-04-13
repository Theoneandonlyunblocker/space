import
{
  Clonable,
  Primitive,
  ShallowObject,
} from "./BasePropInfoClasses";
import {PropInfoType} from "./PropInfoType";

import RampingValueType from "../RampingValue";

import ColorType from "../../../../../src/Color";
import PointType from "../../../../../src/Point";

export class Boolean extends Primitive<boolean>
{
  public readonly type: PropInfoType.Boolean;
}
export class Number extends Primitive<number>
{
  public readonly type: PropInfoType.Number;
}
/* tslint:disable:ban-types */
class FunctionPropType<T extends Function> extends Primitive<T>
{
  public readonly type: PropInfoType.Function;
}
export {FunctionPropType as Function};

export class Point extends ShallowObject<PointType>
{
  public readonly type: PropInfoType.Point;
}
export class Range extends ShallowObject<{min: number, max: number}>
{
  public readonly type: PropInfoType.Range;
}

export class Color extends Clonable<ColorType>
{
  public readonly type: PropInfoType.Color;
}
export class RampingValue extends Clonable<RampingValueType>
{
  public readonly type: PropInfoType.RampingValue;
}
