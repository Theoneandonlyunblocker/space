/// <reference path="../lib/pixi.d.ts" />

import app from "./App"; // TODO global

import WeightedProbability from "./templateinterfaces/WeightedProbability";

import ArchetypeValues from "./ArchetypeValues";
import Personality from "./Personality";
import Player from "./Player";
import Point from "./Point";
import Star from "./Star";
import UnitBattleSide from "./UnitBattleSide";

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
export function getRandomKey<T>(target: {[props: string]: T;}): string
{
  const _targetKeys = Object.keys(target);
  const _rnd = Math.floor(Math.random() * (_targetKeys.length));
  return _targetKeys[_rnd];
}

export function getObjectKeysSortedByValue(obj:
{
  [key: string]: number;
}, order: string)
{
  return Object.keys(obj).sort(function(a, b)
  {
    if (order === "asc")
    {
      return obj[a] - obj[b];
    }
    else return obj[b] - obj[a];
  });
}
export function getObjectKeysSortedByValueOfProp(obj:
{
  [key: string]: any;
}, prop: string, order: string)
{
  return Object.keys(obj).sort(function(a, b)
  {
    if (order === "asc")
    {
      return obj[a][prop] - obj[b][prop];
    }
    else return obj[b][prop] - obj[a][prop];
  });
}
export function sortObjectsByProperty(objects:
{
  [key: string]: any;
}[], prop: string, order: string)
{
  return objects.sort(function(a, b)
  {
    if (order === "asc")
    {
      return a[prop] - b[prop];
    }
    else return b[prop] - a[prop];
  });
}

export function getRandomProperty<T>(target: {[props: string]: T;}): T
{
  const _rndProp = target[getRandomKey(target)];
  return _rndProp;
}
export function getAllPropertiesWithKey<T>(target: {[props: string]: T}, keyToFind: string): T[]
{
  const matchingProperties: T[] = [];
  for (let key in target)
  {
    if (target[key][keyToFind])
    {
      matchingProperties.push(target[key]);
    }
  }

  return matchingProperties;
}
export function getRandomPropertyWithKey<T>(target: {[props: string]: T}, keyToFind: string): T | null
{
  const keys = Object.keys(target);
  while (keys.length > 0)
  {
    const key = getRandomArrayItem(keys);
    const prop = target[key];
    if (prop[keyToFind])
    {
      return prop;
    }
    else
    {
      keys.splice(keys.indexOf(key), 1);
    }
  }

  return null;
}
export function getRandomKeyWithWeights(target: {[prop: string]: number}): string
{
  let totalWeight: number = 0;
  for (let prop in target)
  {
    totalWeight += target[prop];
  }

  let selection = randRange(0, totalWeight);
  for (let prop in target)
  {
    selection -= target[prop];
    if (selection <= 0)
    {
      return prop;
    }
  }

  throw new Error();
}
export function getRandomArrayItemWithWeights<T extends {weight?: number}>(arr: T[]): T
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
export function findItemWithKey<T>(source: {[key: string]: any},
  keyToFind: string, parentKey?: string, _hasParentKey: boolean = false): T
{
  let hasParentKey = _hasParentKey;
  if (source[keyToFind])
  {
    if (!parentKey || hasParentKey)
    {
      return source[keyToFind];
    }
  };

  for (let key in source)
  {
    if (key === parentKey)
    {
      hasParentKey = true;
    }
    if (source[key][keyToFind])
    {
      if (!parentKey || hasParentKey)
      {
        return source[key][keyToFind];
      }
    }
    else if (typeof source[key] === "object")
    {
      return findItemWithKey<T>(source[key], keyToFind, parentKey, hasParentKey);
    }
  }

  return null;
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
  };

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
export function sortByManufactoryCapacityFN(a: Star, b: Star)
{
  const aLevel = (a.manufactory ? a.manufactory.capacity : -1);
  const bLevel = (b.manufactory ? b.manufactory.capacity : -1);

  if (bLevel !== aLevel)
  {
    return bLevel - aLevel;
  }

  const _a: string = a.name.toLowerCase();
  const _b: string = b.name.toLowerCase();

  if (_a > _b) return 1;
  else if (_a < _b) return -1;
  else return 0;
}
export function rectContains(rect:{x1: number, x2: number, y1: number, y2: number}, point: Point)
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
  hex = Math.round(hex);
  const converted = hex.toString(16);
  return "000000".substr(0, 6 - converted.length) + converted;
}
export function stringToHex(text: string)
{
  if (text.charAt(0) === "#")
  {
    text = text.substring(1, 7);
  }

  return parseInt(text, 16);
}
export function drawElementToCanvas(toClone: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): HTMLCanvasElement
{
  const canvas = document.createElement("canvas");
  canvas.width = toClone.width;
  canvas.height = toClone.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(toClone, 0, 0);

  return canvas;
}
export function colorImageInPlayerColor(image: HTMLImageElement, player: Player)
{
  const canvas = document.createElement("canvas");

  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);

  ctx.globalCompositeOperation = "source-in";

  ctx.fillStyle = "#" + player.color.getHexString();
  ctx.fillRect(0, 0, image.width, image.height);

  return canvas.toDataURL();
}

// http://stackoverflow.com/a/1042676
// extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
//
// to[prop] = from[prop] seems to add a reference instead of actually copying value
// so calling the constructor with "new" is needed
export function extendObject(from: any, to?: any, onlyExtendAlreadyPresent: boolean = false)
{
  if (from == null || typeof from != "object") return from;
  if (from.constructor != Object && from.constructor != Array) return from;
  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    return new from.constructor(from);

  to = to || new from.constructor();
  const toIterateOver = onlyExtendAlreadyPresent ? to : from;

  for (let name in toIterateOver)
  {
    if (!onlyExtendAlreadyPresent || from.hasOwnProperty(name))
    {
      to[name] = extendObject(from[name], null);
    }
  }

  return to;
}

export function shallowCopy<T>(toCopy: T): T
{
  return <T> shallowExtend({}, toCopy);
}
// TODO 2017.07.10 | can't we get better typing for this?
export function shallowExtend<T>(destination: any, ...sources: any[]): T
{
  const merged = <T> {};

  sources.forEach(source =>
  {
    for (let key in source)
    {
      merged[key] = source[key];
    }
  });

  return merged;
}

// https://github.com/KyleAMathews/deepmerge
// The MIT License (MIT)
//
// Copyright (c) 2012 Nicholas Fisher
export function deepMerge<T>(target: any, src: any, excludeKeysNotInTarget: boolean = false): T
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
    target = target || [];
    dst = dst.concat(target);
    src.forEach(function(e: any, i: any)
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
        if (target.indexOf(e) === -1)
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
      Object.keys(target).forEach(function (key)
      {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(function (key)
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


export function deletePropertiesNotSharedWithTarget(source: {[key: string]: any},
  target: {[key: string]: any})
{
  const dst: any = {};

  for (let key in target)
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

export function clamp(value: number, min: number, max: number)
{
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
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
export function getAngleBetweenDegrees(degA: number, degB: number)
{
  const angle = Math.abs(degB - degA) % 360;
  const distance = Math.min(360 - angle, angle);
  return distance;
}
export function prettifyDate(date: Date)
{
  return(
    [
      [
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear().toString().slice(2,4),
      ].join("/"),
      [
        date.getHours(),
        date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString(),
      ].join(":"),
    ].join(" ")
  );
}
export function getMatchingLocalstorageItemsByDate(stringToMatch: string)
{
  const allKeys = Object.keys(localStorage);
  const matchingItems: any[] = [];


  for (let i = 0; i < allKeys.length; i++)
  {
    if (allKeys[i].indexOf(stringToMatch) !== -1)
    {
      const item = localStorage.getItem(allKeys[i]);
      const parsed = JSON.parse(item);
      if (parsed.date)
      {
        matchingItems.push(parsed);
      }
    }
  }

  matchingItems.sort(function(a, b)
  {
    return Date.parse(b.date) - Date.parse(a.date);
  });

  return matchingItems;
}
export function shuffleArray(toShuffle: any[], seed?: any)
{
  const rng = new RNG(seed);
  const resultArray = toShuffle.slice(0);

  let i = resultArray.length;

  while (i > 0)
  {
    i--;
    const n = rng.random(0, i);

    const temp = resultArray[i];
    resultArray[i] = resultArray[n];
    resultArray[n] = temp;
  }
  return resultArray;
}
export function getRelativeValue(value: number, min: number, max: number, inverse: boolean = false)
{
  if (inverse)
  {
    if (min === max) return 0;
    else
    {
      return 1 - ((value - min) / (max - min));
    }
  }
  else
  {
    if (min === max) return 1;
    else
    {
      return (value - min) / (max - min);
    }
  }
}
export function getRelativeWeightsFromObject(byCount: {[prop: string]: number}, inverse?: boolean)
{
  const relativeWeights:
  {
    [prop: string]: number;
  } = {};

  const min = 0;
  let max: number;
  for (let prop in byCount)
  {
    const count = byCount[prop];
    max = isFinite(max) ? Math.max(max, count) : count;
  }

  for (let prop in byCount)
  {
    const count = byCount[prop];
    relativeWeights[prop] = getRelativeValue(count, min, max);
  }

  return relativeWeights;
}
export function getDropTargetAtLocation(x: number, y: number)
{
  const dropTargets = document.getElementsByClassName("drop-target");
  const point =
  {
    x: x,
    y: y,
  };

  for (let i = 0; i < dropTargets.length; i++)
  {
    const node = <HTMLElement> dropTargets[i];
    const nodeBounds = node.getBoundingClientRect();

    const rect =
    {
      x1: nodeBounds.left,
      x2: nodeBounds.right,
      y1: nodeBounds.top,
      y2: nodeBounds.bottom,
    };
    if (rectContains(rect, point))
    {
      return node;
    }
  }

  return null;
}
export function onDOMLoaded(onLoaded: () => void)
{
  if (document.readyState === "interactive" || document.readyState === "complete")
  {
    onLoaded();
  }
  else
  {
    document.addEventListener("DOMContentLoaded", onLoaded);
  }
}
export function meetAllPlayers()
{
  for (let i = 0; i < app.game.playerOrder.length; i++)
  {
    const player = app.game.playerOrder[i];
    if (player !== app.humanPlayer)
    {
      app.humanPlayer.diplomacyStatus.meetPlayer(player);
    }
  }
}
export function getItemsFromWeightedProbabilities<T>(probabilities: WeightedProbability<T>[])
{
  let allItems: T[] = [];

  if (probabilities.length === 0)
  {
    return allItems;
  }

  // weighted
  if (probabilities[0].weight)
  {
    const selected = getRandomArrayItemWithWeights<WeightedProbability<T>>(probabilities);
    const firstItem = <WeightedProbability<T>> selected.probabilityItems[0];

    if (firstItem.probabilityItems)
    {
      const probabilityItems = <WeightedProbability<T>[]> selected.probabilityItems;
      allItems = allItems.concat(getItemsFromWeightedProbabilities<T>(probabilityItems));
    }
    else
    {
      const toAdd = <T[]> selected.probabilityItems;
      allItems = allItems.concat(toAdd);
    }
  }
  else
  {
    // flat probability
    for (let i = 0; i < probabilities.length; i++)
    {
      const selected: WeightedProbability<T> = probabilities[i];
      if (Math.random() < selected.flatProbability)
      {
        const firstItem = <WeightedProbability<T>> selected.probabilityItems[0];
        if (firstItem.probabilityItems)
        {
          const probabilityItems = <WeightedProbability<T>[]> selected.probabilityItems;
          allItems = allItems.concat(getItemsFromWeightedProbabilities<T>(probabilityItems));
        }
        else
        {
          const toAdd = <T[]> selected.probabilityItems;
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


export function findEasingFunctionHighPoint(easingFunction: (x: number) => number,
  resolution: number = 10, maxIterations: number = 4,
  startIndex: number = 0, endIndex: number = 1, iteration: number = 0): number
{
  if (iteration >= maxIterations)
  {
    return (startIndex + endIndex) / 2;
  }

  let highestValue: number;
  let highestValueIndex: number;

  const step = (endIndex - startIndex) / resolution;
  for (let i = 0; i < resolution; i++)
  {
    const currentIndex = startIndex + i * step;
    const currentValue = easingFunction(currentIndex);

    if (!isFinite(highestValue) || currentValue > highestValue)
    {
      highestValue = currentValue;
      highestValueIndex = currentIndex;
    }
  }

  return findEasingFunctionHighPoint(easingFunction,
    resolution, maxIterations,
    highestValueIndex - step / 2,
    highestValueIndex + step / 2,
    iteration + 1,
  );
}

export function pointsEqual(p1: Point, p2: Point)
{
  return (p1.x === p2.x && p1.y === p2.y);
}

export function makeRandomPersonality(): Personality
{
  const unitCompositionPreference: ArchetypeValues = {};

  for (let archetype in app.moduleData.Templates.UnitArchetypes)
  {
    unitCompositionPreference[archetype] = Math.random();
  }

  return(
  {
    expansiveness: Math.random(),
    aggressiveness: Math.random(),
    friendliness: Math.random(),

    unitCompositionPreference: unitCompositionPreference,
  });
}
export function splitMultilineText(text: string | React.ReactFragment): string | React.ReactNode[]
{
  if (Array.isArray(text))
  {
    const returnArr: React.ReactNode[] = [];
    for (let i = 0; i < text.length; i++)
    {
      returnArr.push(text[i]);
      returnArr.push(React.DOM.br(
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
export function mergeReactAttributes(
  ...toMerge: React.HTMLAttributes[],
): React.HTMLAttributes
{
  const merged = shallowExtend({}, ...toMerge);

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

    merged[prop] = joined;
  });

  return merged;
}
