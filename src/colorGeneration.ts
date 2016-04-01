import Color from "./Color.ts";
import Range from "./Range.ts";
import
{
  excludeFromRange,
  excludeFromRanges,
  getIntersectingRanges,
  randomSelectFromRanges
} from "./rangeOperations.ts";
import
{
  clamp,
  getAngleBetweenDegrees,
  randRange
} from "./utility.ts";


function makeRandomVibrantColor(): Color
{
  const hRanges =
  [
    {min: 0, max: 90 / 360},
    {min: 120 / 360, max: 150 / 360},
    {min: 180 / 360, max: 290 / 360},
    {min: 320 / 360, max: 1}
  ];
  
  const h = randomSelectFromRanges(hRanges);
  const s = randRange(0.8, 0.9);
  const v = randRange(0.88, 0.92);
  
  return Color.fromHSV(h, s, v);
}

function makeRandomDeepColor(): Color
{
  // yellow
  if (Math.random() < 0.1)
  {
    const h = randRange(15 / 360, 80 / 360);
    const s = randRange(0.92, 1);
    const v = randRange(0.92, 1);
    
    return Color.fromHSV(h, s, v);
  }
  else
  {
    const hRanges =
    [
      {min: 0, max: 15 / 360},
      {min: 100 / 360, max: 195 / 360},
      {min: 210 / 360, max: 1}
    ];
    
    const h = randomSelectFromRanges(hRanges);
    const s = randRange(0.8, 0.9);
    const v = randRange(0.88, 0.92);
    
    return Color.fromHSV(h, s, v);
  }
}
function makeRandomLightColor(): Color
{
  return Color.fromHSV(randRange(0, 1), randRange(0.55, 0.65), 1);
}

// 0.0-1.0
function makeRandomColor(props:
{
  h?: Range[];
  s?: Range[];
  l?: Range[];
}): Color
{
  const hRanges = props.h || [{min: 0, max: 1}];
  const sRanges = props.s || [{min: 0, max: 1}];
  const lRanges = props.l || [{min: 0, max: 1}];
  
  const h = randomSelectFromRanges(hRanges);
  const s = randomSelectFromRanges(sRanges);
  const l = randomSelectFromRanges(lRanges);
  
  return Color.fromHUSL(h, s, l);
}

export function generateMainColor(): Color
{
  // TODO refactor | husl color luminosity gets clamped to 0.3-1.0
  if (Math.random() < 0.6)
  {
    return makeRandomDeepColor();
  }
  else if (Math.random() < 0.25)
  {
    return makeRandomLightColor();
  }
  else if (Math.random() < 0.3)
  {
    return makeRandomVibrantColor();
  }
  else
  {
    // TODO refactor | what kind of color is this?
    return makeRandomColor(
    {
      s: [{min: 1, max: 1}],
      l: [{min: 0.88, max: 1}]
    })
  }
}

function makeContrastingColor(toContrastWith: Color,
colorGenProps?:
{
  initialRanges?:
  {
    h?: Range;
    s?: Range;
    l?: Range;
  };
  minDifference?:
  {
    h?: number;
    s?: number;
    l?: number;
  };
  maxDifference?:
  {
    h?: number;
    // s?: number;
    // l?: number;
  }
}): Color
{
  const props = colorGenProps || {};
  
  const initialRanges = props.initialRanges || {};
  const hRange = initialRanges.h || {min: 0.0, max: 1.0};
  const sRange = initialRanges.s || {min: 0.5, max: 1.0};
  const lRange = initialRanges.l || {min: 0.0, max: 1.0};
  
  const minDifference = props.minDifference || {};
  const hMinDifference = isFinite(minDifference.h) ? minDifference.h : 0.1;
  const sMinDifference = isFinite(minDifference.s) ? minDifference.s : 0.0;
  const lMinDifference = isFinite(minDifference.l) ? minDifference.l : 0.3;
  
  const maxDifference = props.maxDifference || {};
  const hMaxDifference = isFinite(maxDifference.h) ? maxDifference.h : 1.0;
  // const sMaxDifference = isFinite(maxDifference.s) ? maxDifference.s : 1.0;
  // const lMaxDifference = isFinite(maxDifference.l) ? maxDifference.l : 1.0;
  
  const toContrastWithHUSL = toContrastWith.getHUSL();
  
  const hExclusionRange: Range =
  {
    min: (toContrastWithHUSL[0] - hMinDifference) % 1.0,
    max: (toContrastWithHUSL[0] + hMinDifference) % 1.0
  }
  
  const hRangeWithMinExclusion = excludeFromRange(hRange, hExclusionRange);
  const candidateHValue = randomSelectFromRanges(hRangeWithMinExclusion);
  const h = clamp(candidateHValue, toContrastWithHUSL[0] - hMaxDifference, toContrastWithHUSL[0] + hMaxDifference);
  const hDistance = getAngleBetweenDegrees(h * 360, toContrastWithHUSL[0]);
  const relativeHDistance = 1 / (180 / hDistance);
  
  const sExclusionRangeMin = clamp(toContrastWithHUSL[1] - sMinDifference, sRange.min, 1.0);
  const sExclusionRange: Range =
  {
    min: sExclusionRangeMin,
    max: clamp(toContrastWithHUSL[1] + sMinDifference, sExclusionRangeMin, 1.0)
  };
  
  const lExclusionRangeMin = clamp(toContrastWithHUSL[2] - lMinDifference, lRange.min, 1.0);
  const lExclusionRange: Range =
  {
    min: lExclusionRangeMin,
    max: clamp(toContrastWithHUSL[2] + lMinDifference, lExclusionRangeMin, 1.0)
  };
  
  return makeRandomColor(
  {
    h: [{min: h, max: h}],
    s: excludeFromRange(sRange, sExclusionRange),
    l: excludeFromRange(lRange, lExclusionRange)
  });
}

function colorsContrast(aColor: Color, bColor: Color): boolean
{
  const a = aColor.getHUSL();
  const b = bColor.getHUSL();
  
  return Math.abs(a[2] - b[2]) > 0.2;
}

export function generateSecondaryColor(mainColor: Color): Color
{
  // TODO color | used to have secondary system. maybe for more interesting colors?
  return makeContrastingColor(mainColor,
  {
    minDifference:
    {
      h: 0.1,
      l: 0.3
    }
  });
}

export function generateColorScheme(mainColor?: Color)
{
  const main = mainColor || generateMainColor();
  return(
  {
    main: main,
    secondary: generateSecondaryColor(main)
  })
}
