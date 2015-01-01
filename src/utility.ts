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

  export function makeTempPlayerIcon(player: Player, size: number)
  {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#" + hexToString(player.color);
    ctx.fillRect(0, 0, size, size);

    return canvas.toDataURL();
  }
  export function colorImageInPlayerColor(imageSrc: string, player: Player)
  {
    var image = new Image();
    image.src = imageSrc;
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


  export function cloneObject(toClone: any)
  {
    var result: any = {};
    for (var prop in toClone)
    {
      result[prop] = toClone[prop];
    }
    return result;
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
}
