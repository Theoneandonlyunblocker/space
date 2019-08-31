import {Color} from "./Color";
import {Range} from "../math/Range";
import
{
  excludeFromRange,
  randomSelectFromRanges,
} from "../math/rangeOperations";
import
{
  clamp,
  randRange,
} from "../generic/utility";


function makeRandomVibrantColor(): Color
{
  const hRanges =
  [
    {min: 0, max: 90 / 360},
    {min: 120 / 360, max: 150 / 360},
    {min: 180 / 360, max: 290 / 360},
    {min: 320 / 360, max: 1},
  ];

  const h = randomSelectFromRanges(hRanges);
  const s = randRange(0.8, 0.9);
  const v = randRange(0.88, 0.92);

  return Color.fromHSV(h, s, v);
}

function makeRandomDeepColor(): Color
{
  const randomValue = Math.random();
  if (randomValue < 0.88)
  {
    // skips ugly yellow-greens and over-abundant greens
    const hRanges =
    [
      {min: 0 / 360, max: 30 / 360},
      {min: 100 / 360, max: 360 / 360},
    ];

    const h = randomSelectFromRanges(hRanges);
    const s = randRange(0.9, 1.0);
    const v = randRange(0.6, 0.75);

    return Color.fromHSV(h, s, v);
  }
  else if (randomValue < 0.96)
  {
    // yellow
    return makeRandomColor(
    {
      h: [{min: 46 / 360, max: 60 / 360}],
      s: [{min: 1, max: 1}],
      l: [{min: 0.72, max: 0.8}],
    });
  }
  else {
    // orange and brown
    return makeRandomColor(
    {
      h: [{min: 15 / 360, max: 80 / 360}],
      s: [{min: 1, max: 1}],
      l: [{min: 0.45, max: 0.55}],
    });
  }
}
function makeRandomLightVibrantColor(): Color
{
  return Color.fromHSV(randRange(0, 1), randRange(0.55, 0.65), 1);
}
function makeRandomPastelColor(): Color
{
  return makeRandomColor(
  {
    s: [{min: 0.4, max: 0.6}],
    l: [{min: 0.88, max: 1}],
  });
}

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
  const randomValue = Math.random();
  if (randomValue < 0.6)
  {
    return makeRandomDeepColor();
  }
  else if (randomValue < 0.725)
  {
    return makeRandomVibrantColor();
  }
  else if (randomValue < 0.85)
  {
    return makeRandomLightVibrantColor();
  }
  else
  {
    return makeRandomPastelColor();
  }
}

function makeContrastingColor(
  toContrastWith: Color,
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
    };
}): Color
{
  const props = colorGenProps || {};

  const initialRanges = props.initialRanges || {};
  const hRange = initialRanges.h || {min: 0.0, max: 1.0};
  const sRange = initialRanges.s || {min: 0.5, max: 1.0};
  const lRange = initialRanges.l || {min: 0.0, max: 1.0};

  const minDifference = props.minDifference || {};
  const hMinDifference = minDifference.h !== undefined ? minDifference.h : 0.1;
  const sMinDifference = minDifference.s !== undefined ? minDifference.s : 0.0;
  const lMinDifference = minDifference.l !== undefined ? minDifference.l : 0.3;

  const maxDifference = props.maxDifference || {};
  const hMaxDifference = maxDifference.h !== undefined ? maxDifference.h : 1.0;
  // const sMaxDifference = maxDifference.s !== undefined ? maxDifference.s : 1.0;
  // const lMaxDifference = maxDifference.l !== undefined ? maxDifference.l : 1.0;

  const toContrastWithHUSL = toContrastWith.getHUSL();

  const hExclusionRange: Range =
  {
    min: (toContrastWithHUSL[0] - hMinDifference) % 1.0,
    max: (toContrastWithHUSL[0] + hMinDifference) % 1.0,
  };

  const hRangeWithMinExclusion = excludeFromRange(hRange, hExclusionRange);
  const candidateHValue = randomSelectFromRanges(hRangeWithMinExclusion);
  const h = clamp(candidateHValue, toContrastWithHUSL[0] - hMaxDifference, toContrastWithHUSL[0] + hMaxDifference);

  const sExclusionRangeMin = clamp(toContrastWithHUSL[1] - sMinDifference, sRange.min, 1.0);
  const sExclusionRange: Range =
  {
    min: sExclusionRangeMin,
    max: clamp(toContrastWithHUSL[1] + sMinDifference, sExclusionRangeMin, 1.0),
  };

  const lExclusionRangeMin = clamp(toContrastWithHUSL[2] - lMinDifference, lRange.min, 1.0);
  const lExclusionRange: Range =
  {
    min: lExclusionRangeMin,
    max: clamp(toContrastWithHUSL[2] + lMinDifference, lExclusionRangeMin, 1.0),
  };

  return makeRandomColor(
  {
    h: [{min: h, max: h}],
    s: excludeFromRange(sRange, sExclusionRange),
    l: excludeFromRange(lRange, lExclusionRange),
  });
}

export function generateSecondaryColor(mainColor: Color): Color
{
  // could have additional systems here for more variation
  return makeContrastingColor(mainColor,
  {
    minDifference:
    {
      h: 0.1,
      l: 0.3,
    },
  });
}

export function generateColorScheme(mainColor?: Color)
{
  const main = mainColor || generateMainColor();

  return(
  {
    main: main,
    secondary: generateSecondaryColor(main),
  });
}
