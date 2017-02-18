export type SFXFragmentPropType =
  "number" |
  "point" |
  "color" |
  "boolean" |
  "range" |
  "rampingValue" |
  "other"; // TODO 06.02.2017 | temporary. remove this

export type SFXFragmentPropTypes<P> =
{
  [K in keyof P]: SFXFragmentPropType;
}
