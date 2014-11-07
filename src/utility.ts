module Rance
{
  export function randInt(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
}
