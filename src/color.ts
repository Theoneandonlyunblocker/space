/// <reference path="../lib/husl.d.ts" />

import Range from "./Range.ts";
import
{
  clamp,
  getAngleBetweenDegrees,
  hexToString,
  randRange,
  stringToHex
} from "./utility.ts";

// TODO refactor | separate color class


//http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/





export function makeRandomVibrantColor(): number[]
{
  var hRanges =
  [
    {min: 0, max: 90 / 360},
    {min: 120 / 360, max: 150 / 360},
    {min: 180 / 360, max: 290 / 360},
    {min: 320 / 360, max: 1}
  ];
  return [randomSelectFromRanges(hRanges), randRange(0.8, 0.9), randRange(0.88, 0.92)];
}
export function makeRandomDeepColor(): number[]
{
  // yellow
  if (Math.random() < 0.1)
  {
    return [randRange(15 / 360, 80 / 360), randRange(0.92, 1), randRange(0.92, 1)];
  }
  var hRanges =
  [
    {min: 0, max: 15 / 360},
    {min: 100 / 360, max: 195 / 360},
    {min: 210 / 360, max: 1}
  ];
  return [randomSelectFromRanges(hRanges), 1, randRange(0.55, 0.65)];
}
export function makeRandomLightColor(): number[]
{
  return [randRange(0, 360), randRange(0.55, 0.65), 1]
}

export function makeRandomColor(values?:
{
  h?: Range[];
  s?: Range[];
  l?: Range[];
}): number[]
{
  values = values || {};
  var color: any = {};

  ["h", "s", "l"].forEach(function(v)
  {
    if (!values[v]) values[v] = [];
  });


  for (var value in values)
  {
    if (values[value].length < 1)
    {
      values[value] = [{min: 0, max: 1}];
    }

    color[value] = randomSelectFromRanges(values[value]);
  }

  return [color.h, color.s, color.l];
}
export function colorFromScalars(color: number[]): number[]
{
  return [color[0] * 360, color[1] * 100, color[2] * 100];
}
export function scalarsFromColor(scalars: number[]): number[]
{
  return [scalars[0] / 360, scalars[1] / 100, scalars[2] / 100];
}

export function makeContrastingColor(props:
{
  color: number[];
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
    s?: number;
    l?: number;
  }
}): number[]
{
  var initialRanges = props.initialRanges || {};
  var exclusions = props.minDifference || {};
  var maxDifference = props.maxDifference || {};
  var color = props.color;
  var hMaxDiffernece = isFinite(maxDifference.h) ?
    maxDifference.h : 360;
  var sMaxDiffernece = isFinite(maxDifference.s) ?
    maxDifference.s : 100;
  var lMaxDiffernece = isFinite(maxDifference.l) ?
    maxDifference.l : 100;

  var hRange = initialRanges.h || {min: 0, max: 360};
  var sRange = initialRanges.s || {min: 50, max: 100};
  var lRange = initialRanges.l || {min: 0, max: 100};

  var hExclusion = exclusions.h || 30;

  var hMin = (color[0] - hExclusion) % 360;
  var hMax = (color[0] + hExclusion) % 360;

  var hRange2 = excludeFromRange(hRange, {min: hMin, max: hMax});

  var h = randomSelectFromRanges(hRange2);
  h = clamp(h, color[0] - hMaxDiffernece, color[0] + hMaxDiffernece);
  var hDistance = getAngleBetweenDegrees(h, color[0]);
  var relativeHDistance = 1 / (180 / hDistance);

  var lExclusion = exclusions.l || 30;
  // if (relativeHDistance < 0.2)
  // {
  //   lExclusion /= 2;
  //   clamp(lExclusion, 0, 100);
  // }
  // 
  var lMin = clamp(color[2] - lExclusion, lRange.min, 100);
  var lMax = clamp(color[2] + lExclusion, lMin, 100);

  var sExclusion = exclusions.s || 0;
  var sMin = clamp(color[1] - sExclusion, sRange.min, 100);
  var sMax = clamp(color[1] + sExclusion, sMin, 100);


  var ranges =
  {
    h: [{min: h, max: h}],
    s: excludeFromRange(sRange, {min: sMin, max: sMax}),
    l: excludeFromRange(lRange, {min: lMin, max: lMax}),
  }

  return makeRandomColor(ranges);
}
export function hexToHusl(hex: number): number[]
{
  return HUSL.fromHex(hexToString(hex));
}
export function generateMainColor(): number
{
  var color: number[];
  var hexColor: number;
  var genType: string;
  if (Math.random() < 0.6)
  {
    color = makeRandomDeepColor();
    hexColor = hsvToHex.apply(null, color);
    genType = "deep"
  }
  else if (Math.random() < 0.25)
  {
    color = makeRandomLightColor();
    hexColor = hsvToHex.apply(null, color);
    genType = "light"
  }
  else if (Math.random() < 0.3)
  {
    color = makeRandomVibrantColor();
    hexColor = hsvToHex.apply(null, color);
    genType = "vibrant"
  }
  else
  {
    color = makeRandomColor(
    {
      s: [{min: 1, max: 1}],
      l: [{min: 0.88, max: 1}]
    });
    hexColor = stringToHex(
      HUSL.toHex.apply(null, colorFromScalars(color)));
    genType = "husl"
  }


  var huslColor = hexToHusl(hexColor);
  huslColor[2] = clamp(huslColor[2], 30, 100);
  hexColor = stringToHex(HUSL.toHex.apply(null, huslColor));
  return hexColor;
}
export function generateSecondaryColor(mainColor: number): number
{
  var huslColor = hexToHusl(mainColor);
  var hexColor: number;

  if (huslColor[2] < 0.3 || Math.random() < 0.4)
  {
    var contrastingColor = makeContrastingColor(
    {
      color: huslColor,
      minDifference:
      {
        h: 30,
        l: 30
      }
    });
    hexColor = stringToHex(HUSL.toHex.apply(null, contrastingColor));
  }
  else
  {
    function contrasts(c1: number[], c2: number[])
    {
      return(
        (c1[2] < c2[2] - 20 || c1[2] > c2[2] + 20)
      );
    }
    function makeColor(c1: number, easing: number)
    {
      var hsvColor: number[] = hexToHsv(c1); // scalar

      hsvColor = colorFromScalars(hsvColor);
      var contrastingColor = makeContrastingColor(
      {
        color: hsvColor,
        initialRanges:
        {
          l: {min: 60 * easing, max: 100}
        },
        minDifference:
        {
          h: 20 * easing,
          s: 30 * easing
        }
      });

      var hex: number = hsvToHex.apply(null, scalarsFromColor( contrastingColor ));

      return hexToHusl(hex);
    }

    var huslBg = hexToHusl(mainColor);
    var easing = 1;
    var candidateColor = makeColor(mainColor, easing);

    while (!contrasts(huslBg, candidateColor))
    {
      easing -= 0.1;
      candidateColor = makeColor(mainColor, easing);
    }

    hexColor = stringToHex(HUSL.toHex.apply(null, candidateColor));
  }

  return hexColor;
}
export function generateColorScheme(mainColor?: number)
{
  var mainColor = mainColor !== null && isFinite(mainColor) ?
    mainColor :
    generateMainColor();
  var secondaryColor = generateSecondaryColor(mainColor);
  
  return(
  {
    main: mainColor,
    secondary: secondaryColor
  });
}

export function checkRandomGenHues(amt: number): void
{
  var maxBarSize = 80;
  var hues: any = {};
  for (var i = 0; i < amt; i++)
  {
    var color = generateMainColor();
    var hue = colorFromScalars( hexToHsv(color))[0];
    var roundedHue = Math.round(hue / 10) * 10;

    if (!hues[roundedHue]) hues[roundedHue] = 0;
    hues[roundedHue]++;
  }

  var min: number;
  var max: number;

  for (var _hue in hues)
  {
    var count = hues[_hue];

    if (!min)
    {
      min = count;
    }
    if (!max)
    {
      max = count;
    }

    min = Math.min(min, count);
    max = Math.max(max, count);
  }

  var args = [""];
  var toPrint = "";

  for (var _hue in hues)
  {
    var hue = parseInt(_hue);
    var color = hsvToHex(hue / 360, 1, 1);
    var count = hues[_hue];

    var difference = max - min;
    var relative = (count - min) / difference;
    
    var chars = relative * maxBarSize;

    var line = "\n%c ";
    for (var i = 0; i < chars; i++)
    {
      line += "#";
    }
    toPrint += line;
    args.push("color: " + "#" + hexToString(color));
  }

  args[0] = toPrint;

  console.log.apply(console, args);
}
