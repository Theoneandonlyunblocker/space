// https://github.com/Microsoft/TypeScript/issues/7485
// declare interface FlatAndMultiplierAdjustment
// {
//   flat?: number;
//   multiplier?: number;
// }

interface FlatAdjustment
{
  flat: number;
}

interface MultiplierAdjustment
{
  multiplier: number;
}

declare type FlatAndMultiplierAdjustment = FlatAdjustment | MultiplierAdjustment;

export default FlatAndMultiplierAdjustment;
