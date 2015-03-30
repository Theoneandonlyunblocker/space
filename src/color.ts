/// <reference path="../lib/husl.d.ts" />

module Rance
{
  export function hex2rgb(hex: number): number[]
  {
    return(
    [
      (hex >> 16 & 0xFF) / 255,
      (hex >> 8 & 0xFF) / 255,
      (hex & 0xFF) / 255
    ]);
  }

  export function rgb2hex(rgb: number[]): number
  {
    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
  }

  //http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
  /* accepts parameters
   * h  Object = {h:x, s:y, v:z}
   * OR 
   * h, s, v
  */
  export function hsvToRgb(h: number, s: number, v: number): number[]
  {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6)
    {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
  }
  export function hslToRgb(h: number, s: number, l: number): number[]
  {
    var r, g, b;

    if (s == 0)
    {
      r = g = b = l; // achromatic
    }
    else
    {
      function hue2rgb(p, q, t)
      {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b];
  }
  export function rgbToHsv(r, g, b)
  {
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min)
    {
      h = 0; // achromatic
    }
    else
    {
      switch(max)
      {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, v];
  }
  export function rgbToHsl(r: number, g: number, b: number): number[]
  {
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min)
    {
      h = s = 0; // achromatic
    }
    else
    {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max)
      {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  export function hslToHex(h: number, s: number, l: number): number
  {
    return rgb2hex( hslToRgb(h, s, l) );
  }
  export function hsvToHex(h: number, s: number, v: number): number
  {
    return rgb2hex( hsvToRgb(h, s, v) );
  }

  export function hexToHsl(hex: number): number[]
  {
    return rgbToHsl.apply(null, hex2rgb(hex));
  }
  export function hexToHsv(hex: number): number[]
  {
    return rgbToHsv.apply(null, hex2rgb(hex));
  }

  export interface IRange
  {
    min?: number;
    max?: number;
  }

  export function excludeFromRanges(ranges: IRange[], toExclude: IRange): IRange[]
  {
    var intersecting = getIntersectingRanges(ranges, toExclude);

    var newRanges = ranges.slice(0);

    for (var i = 0; i < intersecting.length; i++)
    {
      newRanges.splice(newRanges.indexOf(intersecting[i]), 1);

      var intersectedRanges = excludeFromRange(intersecting[i], toExclude);

      if (intersectedRanges)
      {
        newRanges = newRanges.concat(intersectedRanges);
      }
    }

    return newRanges;
  }

  export function getIntersectingRanges(ranges: IRange[], toIntersectWith: IRange): IRange[]
  {
    var intersecting = [];
    for (var i = 0; i < ranges.length; i++)
    {
      var range = ranges[i];
      if (toIntersectWith.max < range.min || toIntersectWith.min > range.max)
      {
        continue;
      }

      intersecting.push(range);
    }
    return intersecting;
  }

  export function excludeFromRange(range: IRange, toExclude: IRange): IRange[]
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

    var a =
    {
      min: range.min,
      max: toExclude.min
    };
    var b =
    {
      min: toExclude.max,
      max: range.max
    };

    return [a, b];
  }

  export function randomSelectFromRanges(ranges: IRange[])
  {
    var totalWeight = 0;
    var rangesByRelativeWeight:
    {
      [weight: number]: IRange;
    } = {};
    var currentRelativeWeight = 0;

    for (var i = 0; i < ranges.length; i++)
    {
      var range = ranges[i];
      if (!isFinite(range.max)) range.max = 1;
      if (!isFinite(range.min)) range.min = 0;
      var weight = range.max - range.min;

      totalWeight += weight;
    }
    for (var i = 0; i < ranges.length; i++)
    {
      var range = ranges[i];
      var relativeWeight = (range.max - range.min) / totalWeight;
      if (totalWeight === 0) relativeWeight = 1;
      currentRelativeWeight += relativeWeight;
      rangesByRelativeWeight[currentRelativeWeight] = range;
    }

    var rand = Math.random();
    var selectedRange;

    var sortedWeights = Object.keys(rangesByRelativeWeight).map(function(w)
    {
      return parseFloat(w);
    });

    var sortedWeights = sortedWeights.sort();

    for (var i = 0; i < sortedWeights.length; i++)
    {
      if (rand < sortedWeights[i])
      {
        selectedRange = rangesByRelativeWeight[sortedWeights[i]];
        break;
      }
    }
    if (!selectedRange) console.log(rangesByRelativeWeight);

    return randRange(selectedRange.min, selectedRange.max)
  }

  export function makeRandomVibrantColor()
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
  export function makeRandomDeepColor()
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
  export function makeRandomLightColor()
  {
    return [randRange(0, 360), randRange(0.55, 0.65), 1]
  }

  export function makeRandomColor(values?:
  {
    h?: IRange[];
    s?: IRange[];
    l?: IRange[];
  })
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
  export function colorFromScalars(color: number[])
  {
    return [color[0] * 360, color[1] * 100, color[2] * 100];
  }
  export function scalarsFromColor(scalars: number[])
  {
    return [scalars[0] / 360, scalars[1] / 100, scalars[2] / 100];
  }

  export function makeContrastingColor(props:
  {
    color: number[];
    initialRanges?:
    {
      h?: IRange;
      s?: IRange;
      l?: IRange;
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
    var color;
    var hexColor;
    var genType;
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
    var hexColor;

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
      function contrasts(c1, c2)
      {
        return(
          (c1[2] < c2[2] - 20 || c1[2] > c2[2] + 20)
        );
      }
      function makeColor(c1, easing)
      {
        var hsvColor = hexToHsv(c1); // scalar

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

        var hex = <number> hsvToHex.apply(null, scalarsFromColor( contrastingColor ));

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
    mainColor : generateMainColor();
    var secondaryColor = generateSecondaryColor(mainColor);
    
    return(
    {
      main: mainColor,
      secondary: secondaryColor
    });
  }

  export function checkRandomGenHues(amt: number)
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

    var min;
    var max;

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
}
