/// <reference path="../lib/pixi.d.ts" />

import app from "./App"; // TODO global

import WeightedProbability from "./templateinterfaces/WeightedProbability";

import Point from "./Point";
import Player from "./Player";
import Star from "./Star";
import UnitBattleSide from "./UnitBattleSide";
import Personality from "./Personality";
import ArchetypeValues from "./ArchetypeValues";

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
  var _rnd = Math.floor(Math.random() * (target.length));
  return target[_rnd];
}
export function getSeededRandomArrayItem<T>(array: T[], rng: any): T
{
  var _rnd = Math.floor(rng.uniform() * array.length);
  return array[_rnd];
}
export function getRandomKey<T>(target: {[props: string]: T;}): string
{
  var _targetKeys = Object.keys(target);
  var _rnd = Math.floor(Math.random() * (_targetKeys.length));
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
  var _rndProp = target[getRandomKey(target)];
  return _rndProp;
}
export function getAllPropertiesWithKey<T>(target: {[props: string]: T}, keyToFind: string): T[]
{
  var matchingProperties: T[] = [];
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
  var keys = Object.keys(target);
  while (keys.length > 0)
  {
    var key = getRandomArrayItem(keys);
    var prop = target[key];
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
  var totalWeight: number = 0;
  for (let prop in target)
  {
    totalWeight += target[prop];
  }

  var selection = randRange(0, totalWeight);
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
  var totalWeight: number = 0;
  for (let i = 0; i < arr.length; i++)
  {
    totalWeight += arr[i].weight;
  }

  var selection = randRange(0, totalWeight);
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
  keyToFind: string, parentKey?: string, hasParentKey: boolean = false): T
{
  var hasParentKey = hasParentKey;
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
  var result: (T | null)[] = [];
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
  var flattened: T[] = [];
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
  var aLevel = (a.manufactory ? a.manufactory.capacity : -1);
  var bLevel = (b.manufactory ? b.manufactory.capacity : -1);

  if (bLevel !== aLevel)
  {
    return bLevel - aLevel;
  }

  var _a: string = a.name.toLowerCase();
  var _b: string = b.name.toLowerCase();
  
  if (_a > _b) return 1;
  else if (_a < _b) return -1;
  else return 0;
}
export function rectContains(rect:{x1: number, x2: number, y1: number, y2: number}, point: Point)
{
  var x = point.x;
  var y = point.y;

  var x1 = Math.min(rect.x1, rect.x2);
  var x2 = Math.max(rect.x1, rect.x2);
  var y1 = Math.min(rect.y1, rect.y2);
  var y2 = Math.max(rect.y1, rect.y2);

  return(
    (x >= x1 && x <= x2) &&
    (y >= y1 && y <= y2)
  );
}

export function hexToString(hex: number)
{
  hex = Math.round(hex);
  var converted = hex.toString(16);
  return '000000'.substr(0, 6 - converted.length) + converted;
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
  var canvas = document.createElement("canvas");

  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
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
  var toIterateOver = onlyExtendAlreadyPresent ? to : from;

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
export function shallowExtend<T>(destination: any, ...sources: any[]): T
{
  sources.forEach(source =>
  {
    for (let key in source)
    {
      destination[key] = source[key];
    }
  });
  
  return <T>destination;
}

// https://github.com/KyleAMathews/deepmerge
// The MIT License (MIT)
// 
// Copyright (c) 2012 Nicholas Fisher
export function deepMerge<T>(target: any, src: any, excludeKeysNotInTarget: boolean = false): T
{
  if (excludeKeysNotInTarget)
  {
    var merged = deepMerge(target, src, false);
    return deletePropertiesNotSharedWithTarget(merged, target);
  }

  var array = Array.isArray(src);
  var dst: any = array && [] || {};

  if (array)
  {
    target = target || [];
    dst = dst.concat(target);
    src.forEach(function(e: any, i: any)
    {
      if (typeof dst[i] === 'undefined')
      {
        dst[i] = e;
      }
      else if (typeof e === 'object')
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
    if (target && typeof target === 'object')
    {
      Object.keys(target).forEach(function (key)
      {
        dst[key] = target[key];
      })
    }
    Object.keys(src).forEach(function (key)
    {
      if (typeof src[key] !== 'object' || !src[key])
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
  var dst: any = {};

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
    var child = <HTMLElement> parent.children[i];
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
  var resto = value % multiple;
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
  var angle = Math.abs(degB - degA) % 360;
  var distance = Math.min(360 - angle, angle);
  return distance;
}
export function prettifyDate(date: Date)
{
  return(
    [
      [
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear().toString().slice(2,4)
      ].join("/"),
      [
        date.getHours(),
        date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString()
      ].join(":")
    ].join(" ")
  );
}
export function getMatchingLocalstorageItemsByDate(stringToMatch: string)
{
  var allKeys = Object.keys(localStorage);
  var matchingItems: any[] = [];


  for (let i = 0; i < allKeys.length; i++)
  {
    if (allKeys[i].indexOf(stringToMatch) !== -1)
    {
      var item = localStorage.getItem(allKeys[i]);
      var parsed = JSON.parse(item);
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
  var rng = new RNG(seed);
  var resultArray = toShuffle.slice(0);

  var i = resultArray.length;

  while (i > 0)
  {
    i--;
    var n = rng.random(0, i);

    var temp = resultArray[i];
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
  var relativeWeights:
  {
    [prop: string]: number;
  } = {};

  var min = 0;
  var max: number;
  for (let prop in byCount)
  {
    var count = byCount[prop];
    max = isFinite(max) ? Math.max(max, count) : count;
  }

  for (let prop in byCount)
  {
    var count = byCount[prop];
    relativeWeights[prop] = getRelativeValue(count, min, max);
  }

  return relativeWeights;
}
export function getDropTargetAtLocation(x: number, y: number)
{
  var dropTargets = document.getElementsByClassName("drop-target");
  var point =
  {
    x: x,
    y: y
  }

  for (let i = 0; i < dropTargets.length; i++)
  {
    var node = <HTMLElement> dropTargets[i];
    var nodeBounds = node.getBoundingClientRect();

    var rect =
    {
      x1: nodeBounds.left,
      x2: nodeBounds.right,
      y1: nodeBounds.top,
      y2: nodeBounds.bottom
    }
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
    document.addEventListener('DOMContentLoaded', onLoaded);
  }
}
export function meetAllPlayers()
{
  for (let i = 0; i < app.game.playerOrder.length; i++)
  {
    var player = app.game.playerOrder[i];
    if (player !== app.humanPlayer)
    {
      app.humanPlayer.diplomacyStatus.meetPlayer(player);
    }
  }
}
export function getItemsFromWeightedProbabilities<T>(probabilities: WeightedProbability<T>[])
{
  var allItems: T[] = [];

  if (probabilities.length === 0)
  {
    return allItems;
  }

  // weighted
  if (probabilities[0].weight)
  {
    var selected = getRandomArrayItemWithWeights<WeightedProbability<T>>(probabilities);
    var firstItem = <WeightedProbability<T>> selected.probabilityItems[0];

    if (firstItem.probabilityItems)
    {
      var probabilityItems = <WeightedProbability<T>[]> selected.probabilityItems;
      allItems = allItems.concat(getItemsFromWeightedProbabilities<T>(probabilityItems));
    }
    else
    {
      var toAdd = <T[]> selected.probabilityItems;
      allItems = allItems.concat(toAdd);
    }
  }
  else
  {
    // flat probability
    for (let i = 0; i < probabilities.length; i++)
    {
      var selected: WeightedProbability<T> = probabilities[i];
      if (Math.random() < selected.flatProbability)
      {
        var firstItem = <WeightedProbability<T>> selected.probabilityItems[0];
        if (firstItem.probabilityItems)
        {
          var probabilityItems = <WeightedProbability<T>[]> selected.probabilityItems;
          allItems = allItems.concat(getItemsFromWeightedProbabilities<T>(probabilityItems));
        }
        else
        {
          var toAdd = <T[]> selected.probabilityItems;
          allItems = allItems.concat(toAdd);
        }
      }
    }
  }
  return allItems;
}
export function transformMat3(a: Point, m: number[])
{
  var x = m[0] * a.x + m[3] * a.y + m[6];
  var y = m[1] * a.x + m[4] * a.y + m[7];

  return {x: x, y: y};
}
// creating a dummy sprite for attaching a shader to
// works much better than using pixi filters
export function createDummySpriteForShader(x?: number, y?: number,
  width?: number, height?: number)
{
  var texture = getDummyTextureForShader();

  var sprite = new PIXI.Sprite(texture);
  if (x || y)
  {
    sprite.position = new PIXI.Point(x || 0, y || 0);
  }
  if (width)
  {
    sprite.width = width;
  }
  if (height)
  {
    sprite.height = height;
  }

  return sprite;
}
export function getDummyTextureForShader()
{
  var canvas = <any> document.createElement("canvas");
  canvas._pixiId = "dummyShaderTexture"; // pixi will reuse basetexture with this set
  canvas.width = 1;
  canvas.height = 1;
  return PIXI.Texture.fromCanvas(canvas);
}
export function findEasingFunctionHighPoint(easingFunction: (x: number) => number,
  resolution: number = 10, maxIterations: number = 4,
  startIndex: number = 0, endIndex: number = 1, iteration: number = 0): number
{
  if (iteration >= maxIterations)
  {
    return (startIndex + endIndex) / 2;
  }

  var highestValue: number;
  var highestValueIndex: number

  var step = (endIndex - startIndex) / resolution;
  for (let i = 0; i < resolution; i++)
  {
    var currentIndex = startIndex + i * step;
    var currentValue = easingFunction(currentIndex);

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
    iteration + 1
  );
}

export function pointsEqual(p1: Point, p2: Point)
{
  return (p1.x === p2.x && p1.y === p2.y);
}

export function makeRandomPersonality(): Personality
{
  var unitCompositionPreference: ArchetypeValues = {};

  for (let archetype in app.moduleData.Templates.UnitArchetypes)
  {
    unitCompositionPreference[archetype] = Math.random();
  }

  return(
  {
    expansiveness: Math.random(),
    aggressiveness: Math.random(),
    friendliness: Math.random(),

    unitCompositionPreference: unitCompositionPreference
  });
}
export function splitMultilineText(text: string | React.ReactFragment): string | React.ReactNode[]
{
  if (Array.isArray(text))
  {
    var returnArr: React.ReactNode[] = [];
    for (let i = 0; i < text.length; i++)
    {
      returnArr.push(text[i]);
      returnArr.push(React.DOM.br(
      {
        key: "" + i
      }));
    }
    return returnArr;
  }
  else
  {
    return <string> text;
  }
}
export function convertClientRectToPixiRect(rect: ClientRect): PIXI.Rectangle
{
  return new PIXI.Rectangle(
    rect.left,
    rect.top,
    rect.width,
    rect.height
  );
}
export function generateTextureWithBounds(
  renderer: PIXI.SystemRenderer,
  displayObject: PIXI.DisplayObject,
  scaleMode: number,
  resolution: number,
  customBounds: PIXI.Rectangle,
): PIXI.Texture
{
  const bounds = customBounds;

  const renderTexture = PIXI.RenderTexture.create(
    bounds.width || 0,
    bounds.height || 0,
    scaleMode,
    resolution,
  );

  const tempMatrix = new PIXI.Matrix();
  tempMatrix.tx = -bounds.x;
  tempMatrix.ty = -bounds.y;

  renderer.render(displayObject, renderTexture, false, tempMatrix, true);

  return renderTexture;

}
