import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactMotion from "react-motion";

import
{
  NonTerminalProbabilityDistribution,
  ProbabilityDistributions,
  ProbabilityItems,
  WeightedProbabilityDistribution,
} from "../templateinterfaces/ProbabilityDistribution";

import {Point} from "../math/Point";
import {UnitBattleSide} from "../unit/UnitBattleSide";


// TODO refactor | clean these up

export function randInt(min: number, max: number)
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randRange(min: number, max: number)
{
  return Math.random() * (max - min) + min;
}
export function getRandomArrayKey<T>(target: T[]): number
{
  return Math.floor(Math.random() * (target.length));
}
export function getRandomArrayItem<T>(target: T[]): T
{
  const _rnd = Math.floor(Math.random() * (target.length));

  return target[_rnd];
}
export function getSeededRandomArrayItem<T>(array: T[], rng: any): T
{
  const _rnd = Math.floor(rng.uniform() * array.length);

  return array[_rnd];
}
export function getRandomKey<T>(target: {[props: string]: T}): string
{
  const _targetKeys = Object.keys(target);
  const _rnd = Math.floor(Math.random() * (_targetKeys.length));

  return _targetKeys[_rnd];
}
export function getRandomProperty<T>(target: {[props: string]: T}): T
{
  const _rndProp = target[getRandomKey(target)];

  return _rndProp;
}
export function getRandomKeyWithWeights(target: {[prop: string]: number}): string
{
  let totalWeight: number = 0;
  for (const prop in target)
  {
    totalWeight += target[prop];
  }

  let selection = randRange(0, totalWeight);
  for (const prop in target)
  {
    selection -= target[prop];
    if (selection <= 0)
    {
      return prop;
    }
  }

  throw new Error();
}
export function getRandomArrayItemWithWeights<T extends {weight: number}>(arr: T[]): T
{
  let totalWeight: number = 0;
  for (let i = 0; i < arr.length; i++)
  {
    totalWeight += arr[i].weight;
  }

  let selection = randRange(0, totalWeight);
  for (let i = 0; i < arr.length; i++)
  {
    selection -= arr[i].weight;
    if (selection <= 0)
    {
      return arr[i];
    }
  }

  throw new Error();
}
export function getFrom2dArray<T>(target: T[][], arr: number[][]): (T | null)[]
{
  const result: (T | null)[] = [];
  for (let i = 0; i < arr.length; i++)
  {
    if
    (
      (arr[i] !== undefined) &&
      (arr[i][0] >= 0 && arr[i][0] < target.length) &&
      (arr[i][1] >= 0 && arr[i][1] < target[0].length)
    )
    {
      result.push(target[arr[i][0]][arr[i][1]]);
    }
    else
    {
      result.push(null);
    }
  }

  return result;
}
export function flatten2dArray<T>(toFlatten: T[][]): T[]
{
  const flattened: T[] = [];
  for (let i = 0; i < toFlatten.length; i++)
  {
    for (let j = 0; j < toFlatten[i].length; j++)
    {
      flattened.push(toFlatten[i][j]);
    }
  }

  return flattened;
}
export function reverseSide(side: UnitBattleSide): UnitBattleSide
{
  switch (side)
  {
    case "side1":
    {
      return "side2";
    }
    case "side2":
    {
      return "side1";
    }
    default:
    {
      throw new Error("Invalid side");
    }
  }
}
export function rectContains(rect: {x1: number; x2: number; y1: number; y2: number}, point: Point)
{
  const x = point.x;
  const y = point.y;

  const x1 = Math.min(rect.x1, rect.x2);
  const x2 = Math.max(rect.x1, rect.x2);
  const y1 = Math.min(rect.y1, rect.y2);
  const y2 = Math.max(rect.y1, rect.y2);

  return(
    (x >= x1 && x <= x2) &&
    (y >= y1 && y <= y2)
  );
}

export function hexToString(hex: number)
{
  const rounded = Math.round(hex);
  const converted = rounded.toString(16);

  return "000000".substr(0, 6 - converted.length) + converted;
}
export function stringToHex(text: string)
{
  const toParse = text.charAt(0) === "#" ? text.substring(1, 7) : text;

  return parseInt(toParse, 16);
}
// extends 'from' object with members of 'to'. If 'to' is null, a deep clone of 'from' is returned
//
// to[prop] = from[prop] adds a reference instead of actually copying value
// so calling the constructor with "new" is needed
export function extendObject(from: any, to?: any, onlyExtendAlreadyPresent: boolean = false)
{
  if (from === null || typeof from !== "object") { return from; }
  if (from.constructor !== Object && from.constructor !== Array) { return from; }
  // tslint:disable-next-line:prefer-switch
  if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
    from.constructor === String || from.constructor === Number || from.constructor === Boolean) {
    return new from.constructor(from);
  }

  // tslint:disable-next-line:no-parameter-reassignment
  to = to || new from.constructor();
  const toIterateOver = onlyExtendAlreadyPresent ? to : from;

  for (const name in toIterateOver)
  {
    if (!onlyExtendAlreadyPresent || from.hasOwnProperty(name))
    {
      to[name] = extendObject(from[name], null);
    }
  }

  return to;
}

// https://github.com/KyleAMathews/deepmerge
// The MIT License (MIT)
//
// Copyright (c) 2012 Nicholas Fisher
export function deepMerge<T extends S, S>(target: T, src: S, excludeKeysNotInTarget: boolean = false): T
{
  if (excludeKeysNotInTarget)
  {
    const merged = deepMerge(target, src, false);

    return deletePropertiesNotSharedWithTarget(merged, target);
  }

  const array = Array.isArray(src);
  let dst: any = array && [] || {};

  if (array)
  {
    // tslint:disable-next-line:no-parameter-reassignment
    target = <any>target || [];
    dst = dst.concat(target);
    (<any[]><any>src).forEach((e, i) =>
    {
      if (typeof dst[i] === "undefined")
      {
        dst[i] = e;
      }
      else if (typeof e === "object")
      {
        dst[i] = deepMerge(target[i], e);
      }
      else
      {
        if ((<any>target).indexOf(e) === -1)
        {
          dst.push(e);
        }
      }
    });
  }
  else
  {
    if (target && typeof target === "object")
    {
      Object.keys(<object><unknown>target).forEach(key =>
      {
        dst[key] = target[key];
      });
    }
    Object.keys(<object><unknown>src).forEach(key =>
    {
      if (typeof src[key] !== "object" || !src[key])
      {
        dst[key] = src[key];
      }
      else
      {
        if (!target[key])
        {
          dst[key] = src[key];
        }
        else
        {
          dst[key] = deepMerge(target[key], src[key]);
        }
      }
    });
  }

  return dst;
}


function deletePropertiesNotSharedWithTarget(
  source: {[key: string]: any},
  target: {[key: string]: any},
)
{
  const dst: any = {};

  for (const key in target)
  {
    if (typeof target[key] !== "object" || !target[key])
    {
      dst[key] = source[key];
    }
    else
    {
      dst[key] = deletePropertiesNotSharedWithTarget(source[key], target[key]);
    }
  }

  return dst;
}

export function recursiveRemoveAttribute(parent: HTMLElement, attribute: string)
{
  parent.removeAttribute(attribute);

  for (let i = 0; i < parent.children.length; i++)
  {
    const child = <HTMLElement> parent.children[i];
    recursiveRemoveAttribute(child, attribute);
  }
}

export function clamp(value: number, min: number = -Infinity, max: number = Infinity)
{
  if (value < min) { return min; }
  else if (value > max) { return max; }
  else { return value; }
}
// http://stackoverflow.com/a/3254334
export function roundToNearestMultiple(value: number, multiple: number)
{
  const resto = value % multiple;
  if (resto <= (multiple / 2))
  {
    return value - resto;
  }
  else
  {
    return value + multiple - resto;
  }
}
export function prettifyDate(date: Date)
{
  return(
    [
      [
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear().toString().slice(2, 4),
      ].join("/"),
      [
        date.getHours(),
        date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString(),
      ].join(":"),
    ].join(" ")
  );
}
export function getRelativeValue(value: number, min: number, max: number, inverse: boolean = false)
{
  if (inverse)
  {
    if (min === max) { return 0; }
    else
    {
      return 1 - ((value - min) / (max - min));
    }
  }
  else
  {
    if (min === max) { return 1; }
    else
    {
      return (value - min) / (max - min);
    }
  }
}
export function linearStep(value: number, min: number, max: number, inverse: boolean = false): number
{
  return clamp(getRelativeValue(value, min, max, inverse), 0.0, 1.0);
}
export function getRelativeWeightsFromObject(byCount: {[prop: string]: number})
{
  const relativeWeights:
  {
    [prop: string]: number;
  } = {};

  const min = 0;
  const max = Object.keys(byCount).map(key =>
  {
    return byCount[key];
  }).reduce((maxWeight, itemWeight) =>
  {
    return Math.max(maxWeight, itemWeight);
  }, min);

  for (const prop in byCount)
  {
    const count = byCount[prop];
    relativeWeights[prop] = getRelativeValue(count, min, max);
  }

  return relativeWeights;
}
export function loadDom(): Promise<void>
{
  if (document.readyState === "interactive" || document.readyState === "complete")
  {
    return Promise.resolve();
  }
  else
  {
    return new Promise((resolve) =>
    {
      document.addEventListener("DOMContentLoaded", () =>
      {
        resolve();
      });
    });
  }
}
export function probabilityDistributionsAreWeighted<T>(distributions: ProbabilityDistributions<T>): distributions is WeightedProbabilityDistribution<T>[]
{
  return Boolean((<WeightedProbabilityDistribution<T>[]> distributions)[0].weight);
}
export function probabilityItemsAreTerminal<T>(items: ProbabilityItems<T>): items is T[]
{
  const firstItem = (<NonTerminalProbabilityDistribution<T>> items[0]);

  return !firstItem.probabilityItems;
}
export function getItemsFromProbabilityDistributions<T>(distributions: ProbabilityDistributions<T>)
{
  let allItems: T[] = [];

  if (distributions.length === 0)
  {
    return allItems;
  }

  // weighted
  if (probabilityDistributionsAreWeighted(distributions))
  {
    const selected = getRandomArrayItemWithWeights(distributions);

    if (!probabilityItemsAreTerminal(selected.probabilityItems))
    {
      const probabilityItems = selected.probabilityItems;
      allItems = allItems.concat(getItemsFromProbabilityDistributions<T>(probabilityItems));
    }
    else
    {
      const toAdd = selected.probabilityItems;
      allItems = allItems.concat(toAdd);
    }
  }
  else
  {
    for (let i = 0; i < distributions.length; i++)
    {
      const selected = distributions[i];
      if (Math.random() < selected.flatProbability)
      {
        if (!probabilityItemsAreTerminal(selected.probabilityItems))
        {
          allItems = allItems.concat(getItemsFromProbabilityDistributions<T>(selected.probabilityItems));
        }
        else
        {
          const toAdd = selected.probabilityItems;
          allItems = allItems.concat(toAdd);
        }
      }
    }
  }

  return allItems;
}
export function transformMat3(a: Point, m: number[])
{
  const x = m[0] * a.x + m[3] * a.y + m[6];
  const y = m[1] * a.x + m[4] * a.y + m[7];

  return {x: x, y: y};
}

export function shallowEqual<T extends object>(a: T, b: T): boolean
{
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  const hasSameAmountOfProperties = aProps.length === bProps.length;
  if (!hasSameAmountOfProperties)
  {
    return false;
  }

  const allPropertyValuesMatch = aProps.every(prop =>
  {
    return a[prop] === b[prop];
  });
  if (!allPropertyValuesMatch)
  {
    return false;
  }

  return true;
}
export function pointsEqual(p1: Point, p2: Point)
{
  return (p1.x === p2.x && p1.y === p2.y);
}

export function splitMultilineText(text: string | React.ReactFragment): string | React.ReactNode[]
{
  if (Array.isArray(text))
  {
    const returnArr: React.ReactNode[] = [];
    for (let i = 0; i < text.length; i++)
    {
      returnArr.push(text[i]);
      returnArr.push(ReactDOMElements.br(
      {
        key: "" + i,
      }));
    }

    return returnArr;
  }
  else
  {
    return <string> text;
  }
}
// TODO 2017.07.11 | this should be in a base class for ui components instead
export function mergeReactAttributes<T>(
  ...toMerge: React.HTMLAttributes<T>[]
): React.HTMLAttributes<T>
{
  const merged = toMerge.reduce((allAttributes, currentAttributes) =>
  {
    return {...allAttributes, ...currentAttributes};
  }, {});

  const stringProps = ["className", "id"];
  stringProps.forEach(prop =>
  {
    const joined = toMerge.filter(attributes =>
    {
      return Boolean(attributes[prop]);
    }).map(attributes =>
    {
      return attributes[prop];
    }).join(" ");

    if (joined)
    {
      merged[prop] = joined;
    }
  });

  return merged;
}
export function getUniqueArrayKeys<T>(source: T[], getIdentifier: ((v: T) => string)): T[]
{
  const uniqueKeysById: {[id: string]: T} = {};

  source.forEach(key =>
  {
    const id = getIdentifier(key);
    uniqueKeysById[id] = key;
  });

  return Object.keys(uniqueKeysById).map(type => uniqueKeysById[type]);
}
// tslint:disable:no-bitwise
export function extractFlagsFromFlagWord<F extends number, E extends {[K in Extract<keyof E, string>]: F}>(flagWord: F, allFlags: E): F[]
{
  if (flagWord === 0)
  {
    const hasExplicitZeroFlag = isFinite(allFlags[0]);
    if (hasExplicitZeroFlag)
    {
      return [allFlags[0]];
    }
    else
    {
      return [];
    }
  }

  const allPresentFlags = Object.keys(allFlags).map(key =>
  {
    return allFlags[key];
  }).filter(flag =>
  {
    return Boolean(flagWord & flag);
  });

  return allPresentFlags;
}
// tslint:enable:no-bitwise
// tslint:disable-next-line:ban-types
export function getFunctionName(f: Function): string
{
  const result = /^function\s+([\w\$]+)\s*\(/.exec(f.toString());

  return result ? result[1] : "anonymous";
}
// https://github.com/chenglou/react-motion/issues/265#issuecomment-184697874
export function fixedDurationSpring(
  value: number,
  duration: number, // in ms
  overshoot: number = 0,
): ReactMotion.OpaqueConfig
{
  const w = duration / 1000; // in s
  const o = overshoot;

  const s = o <= 0
    ? 1 - o
    : 1 / Math.sqrt(1 + Math.pow(2 * Math.PI / Math.log(1 / (o * o)), 2));

  const ks = (2 * Math.PI / w) / Math.max(Math.sqrt(1 - s * s), 0.5);

  // animations break apart if set too high, these should be fast enough for the eye
  const damping = Math.min(2 * ks * s, 100);
  const stiffness = Math.min(ks * ks, 1000);

  return ReactMotion.spring(value, {stiffness: stiffness, damping: damping});
}
export function stringIsSignedFloat(toCheck: string): boolean
{
  const signedFloatRegex = /^(-?(?:0|[1-9]\d*)(?:\.\d+)?)?$/;

  return signedFloatRegex.test(toCheck);
}
export function getDistanceBetweenPoints(a: Point, b: Point): number
{
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}
export function getAngleBetweenPoints(a: Point, b: Point): number
{
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;

  return Math.atan2(deltaY, deltaX);
}
export function shuffleArrayInPlace<T>(toShuffle: T[]): void
{
  for (let i = 0; i < toShuffle.length - 2; i++)
  {
    const j = randInt(i, toShuffle.length - 1);
    const temp = toShuffle[j];
    toShuffle[j] = toShuffle[i];
    toShuffle[i] = temp;
  }
}
export function joinObjectValues<T>(...toJoin: T[]): {[K in keyof T]: T[K][]}
{
  return toJoin.reduce((joined, current) =>
  {
    for (const key in current)
    {
      if (!joined[key])
      {
        joined[key] = [];
      }

      joined[key].push(current[key]);
    }

    return joined;
  }, <{[K in keyof T]: T[K][]}>{});
}
export function sumObjectValues<T extends {[key: string]: number}>(...toSum: T[]): T
{
  return toSum.reduce((summed, currentObj) =>
  {
    for (const key in currentObj)
    {
      if (!summed[key])
      {
        summed[key] = 0;
      }

      summed[key] += currentObj[key];
    }

    return summed;
  }, <any>{});
}
export function loadCss(url: string, baseUrl: string): void
{
  const link = document.createElement("link");
  link.href = new URL(url, baseUrl).toString();
  link.type = "text/css";
  link.rel = "stylesheet";

  document.getElementsByTagName("head")[0].appendChild(link);
}
export function remapObjectKeys<
  T extends {[key: string]: any},
  K extends Partial<Record<keyof T, string>>
>(target: T, keyReplacements: K)
{
  Object.keys(keyReplacements).forEach(oldKey =>
  {
    const newKey = keyReplacements[oldKey];
    target[newKey] = target[oldKey];
  });

  return target as unknown as (
    Omit<T, keyof K> &
    {[Prop in keyof T as K[Prop]]: T[Prop]}
  );
}
