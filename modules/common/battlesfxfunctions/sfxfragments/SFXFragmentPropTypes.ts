import Color from "../../../../src/Color";
import Point from "../../../../src/Point";

type SFXFragmentPropType =
  "number" |
  "point" |
  "color";

interface SFXFragmentPropTypes
{
  [propName: string]: SFXFragmentPropType;
}

export default SFXFragmentPropTypes;
