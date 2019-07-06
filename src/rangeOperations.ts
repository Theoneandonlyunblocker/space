import {Range} from "./Range";
import
{
  randRange,
} from "./utility";


export function excludeFromRanges(ranges: Range[], toExclude: Range): Range[]
{
  const intersecting = getIntersectingRanges(ranges, toExclude);

  let newRanges = ranges.slice(0);

  for (let i = 0; i < intersecting.length; i++)
  {
    newRanges.splice(newRanges.indexOf(intersecting[i]), 1);

    const intersectedRanges = excludeFromRange(intersecting[i], toExclude);

    if (intersectedRanges)
    {
      newRanges = newRanges.concat(intersectedRanges);
    }
  }

  return newRanges;
}

export function getIntersectingRanges(ranges: Range[], toIntersectWith: Range): Range[]
{
  const intersecting: Range[] = [];
  for (let i = 0; i < ranges.length; i++)
  {
    const range = ranges[i];
    if (toIntersectWith.max < range.min || toIntersectWith.min > range.max)
    {
      continue;
    }

    intersecting.push(range);
  }

  return intersecting;
}

export function rangesHaveOverlap(...ranges: Range[]): boolean
{
  const sorted = ranges.sort((a, b) =>
  {
    return a.min - b.min;
  });

  for (let i = 0; i < sorted.length - 1; i++)
  {
    if (sorted[i].max > sorted[i + 1].min)
    {
      return true;
    }
  }

  return false;
}

export function excludeFromRange(range: Range, toExclude: Range): Range[]
{
  if (toExclude.max < range.min || toExclude.min > range.max)
  {
    return null;
  }
  else if (toExclude.min < range.min && toExclude.max > range.max)
  {
    return null;
  }

  if (toExclude.min <= range.min)
  {
    return(
      [{min: toExclude.max, max: range.max}]
    );
  }
  else if (toExclude.max >= range.max)
  {
    return(
      [{min: range.min, max: toExclude.min}]
    );
  }

  return(
  [
    {
      min: range.min,
      max: toExclude.min,
    },
    {
      min: toExclude.max,
      max: range.max,
    },
  ]);
}

export function randomSelectFromRanges(ranges: Range[]): number
{
  let totalWeight = 0;
  let currentRelativeWeight = 0;
  const rangesByRelativeWeight:
  {
    [weight: number]: Range;
  } = {};

  for (let i = 0; i < ranges.length; i++)
  {
    const range = ranges[i];
    if (!isFinite(range.max)) { range.max = 1; }
    if (!isFinite(range.min)) { range.min = 0; }
    const weight = range.max - range.min;

    totalWeight += weight;
  }
  for (let i = 0; i < ranges.length; i++)
  {
    const range = ranges[i];
    let relativeWeight = (range.max - range.min) / totalWeight;
    if (totalWeight === 0) { relativeWeight = 1; }
    currentRelativeWeight += relativeWeight;
    rangesByRelativeWeight[currentRelativeWeight] = range;
  }

  const rand = Math.random();

  const sortedWeights = Object.keys(rangesByRelativeWeight).map(weight => parseFloat(weight)).sort();

  for (let i = 0; i < sortedWeights.length; i++)
  {
    if (rand < sortedWeights[i])
    {
      const selectedRange = rangesByRelativeWeight[sortedWeights[i]];

      return randRange(selectedRange.min, selectedRange.max);
    }
  }

  throw new Error("Couldn't select from ranges.");

}
