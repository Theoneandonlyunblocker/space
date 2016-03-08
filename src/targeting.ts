/// <reference path="utility.ts"/>
/// <reference path="unit.ts"/>


module Rance
{
  export enum TargetFleet
  {
    ally = 0,
    enemy = 1,
    either = 2
  }

  export interface TargetRangeFunction
  {
    (units: Unit[][], user: Unit): Unit[];
  }
  export var targetSelf: TargetRangeFunction = function(units: Unit[][], user: Unit)
  {
    return [user];
  }
  export var targetNextRow: TargetRangeFunction = function(units: Unit[][], user: Unit)
  {
    var ownPosition = user.battleStats.position;
    var increment = user.battleStats.side === "side1" ? 1 : -1;
    return units[ownPosition[0] + increment];
  }
  export var targetAll: TargetRangeFunction = function(units: Unit[][], user: Unit)
  {
    return flatten2dArray(units);
  }

  export interface BattleAreaFunction
  {
    (units: Unit[][], target: number[]): Unit[];
  }
  //**
  //**
  //X*
  //**
  export var areaSingle: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    return getFrom2dArray(units, [target]);
  };

  //XX
  //XX
  //XX
  //XX
  export var areaAll: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    return flatten2dArray(units);
  };

  //**
  //**
  //XX
  //**
  export var areaRow: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    var y = target[1];
    var targetLocations: number[][] = [];

    for (var i = 0; i < units.length; i++)
    {
      targetLocations.push([i,y]);
    }

    return getFrom2dArray(units, targetLocations);
  };

  //X*
  //X*
  //X*
  //X*
  export var areaColumn: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    var x = target[0];
    var targetLocations: number[][] = [];

    for (var i = 0; i < units[x].length; i++)
    {
      targetLocations.push([x,i]);
    }

    return getFrom2dArray(units, targetLocations);
  };

  //**
  //X*
  //X*
  //X*
  export var areaColumnNeighbors: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    var x = target[0];
    var y = target[1];
    var targetLocations: number[][] = [];

    targetLocations.push([x, y]);
    targetLocations.push([x, y-1]);
    targetLocations.push([x, y+1]);

    return getFrom2dArray(units, targetLocations);
  };

  //**
  //X*
  //XX
  //X*
  export var areaNeighbors: BattleAreaFunction = function(units: Unit[][], target: number[])
  {
    var x = target[0];
    var y = target[1];
    var targetLocations: number[][] = [];

    targetLocations.push([x, y]);
    targetLocations.push([x-1, y]);
    targetLocations.push([x+1, y]);
    targetLocations.push([x, y-1]);
    targetLocations.push([x, y+1]);

    return getFrom2dArray(units, targetLocations);
  };
}
