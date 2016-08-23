import Color from "../../../../src/Color";
import Point from "../../../../src/Point";

export interface SFXFragmentNumberProp
{
  type: "number";
  defaultValue: number;
  min?: number;
  max?: number;
}
export interface SFXFragmentPointProp
{
  type: "point";
  defaultValue: Point;
  min?: Point;
  max?: Point;
}
export interface SFXFragmentColorProp
{
  type: "color";
  defaultValue: Color;
}

type SFXFragmentProp =
  SFXFragmentNumberProp |
  SFXFragmentPointProp |
  SFXFragmentColorProp;

export interface SFXFragmentPropTypes
{
  [prop: string]: SFXFragmentProp;
}

export default SFXFragmentPropTypes;
