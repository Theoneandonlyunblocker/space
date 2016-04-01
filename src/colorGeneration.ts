import Color from "./Color.ts";
import Range from "./Range.ts";
import
{
  excludeFromRange,
  excludeFromRanges,
  getIntersectingRanges,
  randomSelectFromRanges
} from "./rangeOperations.ts"

function makeRandomVibrantColor(): Color
{
  let hRanges =
  [
    {min: 0, max: 90 / 360},
    {min: 120 / 360, max: 150 / 360},
    {min: 180 / 360, max: 290 / 360},
    {min: 320 / 360, max: 1}
  ];
}