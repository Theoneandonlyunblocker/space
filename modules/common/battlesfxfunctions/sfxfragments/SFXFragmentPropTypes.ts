import Color from "../../../../src/Color";
import Point from "../../../../src/Point";

export type SFXFragmentPropType =
  "number" |
  "point" |
  "color" |
  "boolean" |
  "range";

interface SFXFragmentPropTypes
{
  [propName: string]: SFXFragmentPropType;
}

export default SFXFragmentPropTypes;
