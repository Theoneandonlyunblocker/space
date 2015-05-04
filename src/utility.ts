/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/clipper.d.ts" />

module Rance
{
  export function randInt(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  export function randRange(min, max)
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
  export function getRandomKey(target)
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

  export function getRandomProperty(target)
  {
    var _rndProp = target[getRandomKey(target)];
    return _rndProp;
  }
  export function getFrom2dArray(target: any[][], arr: number[][]): any[]
  {
    var result = [];
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
  export function divmod(x, y)
  {
    var a = Math.floor(x / y);
    var b = x % y;
    return [a, b];
  }
  export function flatten2dArray(toFlatten: any[][]): any[]
  {
    var flattened = [];
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

  export function makeRandomShip()
  {
    var allTypes = Object.keys(Templates.ShipTypes);
    var type = getRandomArrayItem(allTypes);

    var unit = new Unit(Templates.ShipTypes[type]);

    return unit;
  }

  export function centerDisplayObjectContainer(toCenter: PIXI.DisplayObjectContainer)
  {
    toCenter.x -= toCenter.width / 2;
  }
  export function rectContains(rect, point)
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
  export function extendObject(from: any, to?: any)
  {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
      from.constructor == String || from.constructor == Number || from.constructor == Boolean)
      return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from)
    {
      to[name] = extendObject(from[name], null);
    }

    return to;
  }
  export function recursiveRemoveAttribute(parent, attribute: string)
  {
    parent.removeAttribute(attribute);

    for (var i = 0; i < parent.children.length; i++)
    {
      recursiveRemoveAttribute(parent.children[i], attribute);
    }
  }

  export function clamp(value: number, min: number, max: number)
  {
    if (value < min) return min;
    else if (value > max) return max;
    else return value;
  }
  export function getAngleBetweenDegrees(degA: number, degB: number)
  {
    var angle = Math.abs(degB - degA) % 360;
    var distance = Math.min(360 - angle, angle);
    //console.log(degA, degB, distance);
    return distance;
  }
  export function shiftPolygon(polygon: Point[], amount: number)
  {
    return polygon.map(function(point)
    {
      return(
      {
        x: point.x + amount,
        y: point.y + amount
      });
    });
  }
  export function convertCase(polygon: any[]): any
  {
    if (isFinite(polygon[0].x))
    {
      return polygon.map(function(point)
      {
        return(
        {
          X: point.x,
          Y: point.y
        });
      })
    }
    else
    {
      return polygon.map(function(point)
      {
        return(
        {
          x: point.X,
          y: point.Y
        });
      })
    }
  }
  export function offsetPolygon(polygon: Point[], amount: number)
  {
    polygon = convertCase(polygon);
    var scale = 100;
    ClipperLib.JS.ScaleUpPath(polygon, scale);

    ClipperLib.Clipper.SimplifyPolygon(polygon, ClipperLib.PolyFillType.pftNonZero);
    ClipperLib.Clipper.CleanPolygon(polygon, 0.1 * scale);

    var co = new ClipperLib.ClipperOffset(2, 0.01);
    co.AddPath(polygon, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
    var offsetted = new ClipperLib.Path();

    co.Execute(offsetted, amount * scale);

    if (offsetted.length < 1)
    {
      console.warn("couldn't offset polygon");
      return null;
    }

    var converted = convertCase(offsetted[0]);

    return converted.map(function(point)
    {
      return(
      {
        x: point.x / scale,
        y: point.y / scale
      });
    });
  }

  export function arraysEqual(a1: any[], a2: any[])
  {
    if (a1 === a2) return true;
    if (!a1 || !a2) return false;
    if (a1.length !== a2.length) return false;

    a1.sort();
    a2.sort();

    for (var i = 0; i < a1.length; i++)
    {
      if (a1[i] !== a2[i]) return false;
    }

    return true;
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
  export function shuffleArray(toShuffle: any[])
  {
    var resultArray = toShuffle.slice(0);

    var i = resultArray.length;

    while (i > 0)
    {
      i--;
      var n = randInt(0, i);

      var temp = resultArray[i];
      resultArray[i] = resultArray[n];
      resultArray[n] = temp;
    }
    return resultArray;
  }
  export function getRelativeValue(value: number, min: number, max: number)
  {
    if (min === max) return 1;
    else
    {
      return (value - min) / (max - min);
    }
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

  export function inspectSave(saveName: string)
  {
    var saveKey = "Rance.Save." + saveName;
    var save = localStorage.getItem(saveKey);

    return JSON.parse(save);
  }
}
