/// <reference path="../lib/pixi.d.ts" />

module Rance
{
  export function randInt(min: number, max: number)
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  export function randRange(min: number, max: number)
  {
    return Math.random() * (max - min) + min;
  }
  export function getRandomArrayKey(target: any[])
  {
    return Math.floor(Math.random() * (target.length));
  }
  export function getRandomArrayItem(target: any[])
  {
    var _rnd = Math.floor(Math.random() * (target.length));
    return target[_rnd];
  }
  export function getSeededRandomArrayItem(array: any[], rng: any)
  {
    var _rnd = Math.floor(rng.uniform() * array.length);
    return array[_rnd];
  }
  export function getRandomKey(target: {[props: string]: any;})
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

  export function getRandomProperty(target: {[props: string]: any;})
  {
    var _rndProp = target[getRandomKey(target)];
    return _rndProp;
  }
  export function getAllPropertiesWithKey(target: {[props: string]: any}, keyToFind: string)
  {
    var matchingProperties: any[] = [];
    for (var key in target)
    {
      if (target[key][keyToFind])
      {
        matchingProperties.push(target[key]);
      }
    }

    return matchingProperties;
  }
  export function getRandomPropertyWithKey(target: {[props: string]: any}, keyToFind: string)
  {
    var keys = Object.keys(target);
    while (keys.length > 0)
    {
      var key = getRandomArrayItem(keys);
      var prop = target[key];
      if (prop[keyToFind])
      {
        return prop[keyToFind];
      }
      else
      {
        keys.splice(keys.indexOf(key), 1);
      }
    }

    return null;
  }
  export function getRandomKeyWithWeights(target: {[prop: string]: number})
  {
    var totalWeight: number = 0;
    for (var prop in target)
    {
      totalWeight += target[prop];
    }

    var selection = randRange(0, totalWeight);
    for (var prop in target)
    {
      selection -= target[prop];
      if (selection <= 0)
      {
        return prop;
      }
    }
  }
  export function getRandomArrayItemWithWeights<T extends {weight?: number}>(arr: T[]): T
  {
    var totalWeight: number = 0;
    for (var i = 0; i < arr.length; i++)
    {
      totalWeight += arr[i].weight;
    }

    var selection = randRange(0, totalWeight);
    for (var i = 0; i < arr.length; i++)
    {
      selection -= arr[i].weight;
      if (selection <= 0)
      {
        return arr[i];
      }
    }
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

    for (var key in source)
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
  export function getFrom2dArray(target: any[][], arr: number[][]): any[]
  {
    var result: any[] = [];
    for (var i = 0; i < arr.length; i++)
    {
      if 
      ( 
        (arr[i] !== undefined) &&
        (arr[i][0] >= 0 && arr[i][0] < target.length) &&
        (arr[i][1] >= 0 && arr[i][1] < target[0].length)
      )
      {
        result.push( target[arr[i][0]][arr[i][1]] );
      }
      else
      {
        result.push(null);
      }

    };
    return result;
  }
  export function flatten2dArray(toFlatten: any[][]): any[]
  {
    var flattened: any[] = [];
    for (var i = 0; i < toFlatten.length; i++)
    {
      for (var j = 0; j < toFlatten[i].length; j++)
      {
        flattened.push(toFlatten[i][j]);
      }
    }

    return flattened;
  }
  export function reverseSide(side: string)
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

  export function turnOrderSortFunction(a: Unit, b: Unit)
  {
    if (a.battleStats.moveDelay !== b.battleStats.moveDelay)
    {
      return a.battleStats.moveDelay - b.battleStats.moveDelay;
    }
    else
    {
      return a.id - b.id;
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
  export function colorImageInPlayerColor(image: HTMLImageElement, player: Player)
  {
    var canvas = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.globalCompositeOperation = "source-in";

    ctx.fillStyle = "#" + hexToString(player.color);
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

    for (var name in toIterateOver)
    {
      if (!onlyExtendAlreadyPresent || from.hasOwnProperty(name))
      {
        to[name] = extendObject(from[name], null);
      }
    }

    return to;
  }
  export function recursiveRemoveAttribute(parent: HTMLElement, attribute: string)
  {
    parent.removeAttribute(attribute);

    for (var i = 0; i < parent.children.length; i++)
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
    //console.log(degA, degB, distance);
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


    for (var i = 0; i < allKeys.length; i++)
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
    for (var prop in byCount)
    {
      var count = byCount[prop];
      max = isFinite(max) ? Math.max(max, count) : count;
    }

    for (var prop in byCount)
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

    for (var i = 0; i < dropTargets.length; i++)
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
    for (var i = 0; i < app.game.playerOrder.length; i++)
    {
      var player = app.game.playerOrder[i];
      if (player !== app.humanPlayer)
      {
        app.humanPlayer.diplomacyStatus.meetPlayer(player);
      }
    }
  }
  export function getItemsFromWeightedProbabilities<T>(probabilities: Templates.IWeightedProbability<T>[])
  {
    var allItems: T[] = [];

    if (probabilities.length === 0)
    {
      return allItems;
    }

    // weighted
    if (probabilities[0].weight)
    {
      var selected = getRandomArrayItemWithWeights<Templates.IWeightedProbability<T>>(probabilities);
      var firstItem = <Templates.IWeightedProbability<T>> selected.probabilityItems[0];

      if (firstItem.probabilityItems)
      {
        var probabilityItems = <Templates.IWeightedProbability<T>[]> selected.probabilityItems;
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
      for (var i = 0; i < probabilities.length; i++)
      {
        var selected: Templates.IWeightedProbability<T> = probabilities[i];
        if (Math.random() < selected.flatProbability)
        {
          var firstItem = <Templates.IWeightedProbability<T>> selected.probabilityItems[0];
          if (firstItem.probabilityItems)
          {
            var probabilityItems = <Templates.IWeightedProbability<T>[]> selected.probabilityItems;
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
  export function defaultNameGenerator(unit: Unit)
  {
    return "" + unit.id + " " + unit.template.displayName;
  }
}
