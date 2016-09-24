export type SFXFragmentPropType =
  "number" |
  "point" |
  "color" |
  "boolean" |
  "range" |
  "rampingValue";

interface SFXFragmentPropTypes
{
  [propName: string]: SFXFragmentPropType;
}

export default SFXFragmentPropTypes;
