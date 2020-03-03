import {Color as ColorType} from "core/src/color/Color";
import {Point as PointType} from "core/src/math/Point";
import {RampingValue as RampingValueType} from "../RampingValue";

import
{
  Clonable,
  Primitive,
  ShallowObject,
} from "./BasePropInfoClasses";
import {PropInfoType} from "./PropInfoType";


export class Boolean extends Primitive<boolean>
{
  public readonly type = PropInfoType.Boolean;
}
export class Number extends Primitive<number>
{
  public readonly type = PropInfoType.Number;
}
/* tslint:disable:ban-types */
class FunctionPropType<T extends Function> extends Primitive<T>
{
  public readonly type = PropInfoType.Function;
}
export {FunctionPropType as Function};

export class Point extends ShallowObject<PointType>
{
  public readonly type = PropInfoType.Point;
}
export class Range extends ShallowObject<{min: number; max: number}>
{
  public readonly type = PropInfoType.Range;
}

export class Color extends Clonable<ColorType>
{
  public readonly type = PropInfoType.Color;
}
export class RampingValue extends Clonable<RampingValueType>
{
  public readonly type = PropInfoType.RampingValue;
}
