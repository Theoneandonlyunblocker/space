/// <reference path="../lib/pixi.d.ts" />

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
  export function getRandomArrayItem( target: any[] )
  {
    var _rnd = Math.floor(Math.random() * (target.length));
    return target[_rnd];
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
    var converted = hex.toString(16);
    return '000000'.substr(0, 6 - converted.length) + converted;
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
  export function addFleet(player: Player, shipAmount: number)
  {
    var ships = [];
    for (var i = 0; i < shipAmount; i++)
    {
      ships.push(makeRandomShip());
    }
    var fleet = new Fleet(player, ships, mapGen.points[0]);
  }

  /**
   * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   * 
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  export function hslToRgb(h, s, l)
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

  export function hslToHex(h, s, l)
  {
    return PIXI.rgb2hex ( hslToRgb(h, s, l) );
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
}
