/// <reference path="utility.ts"/>
/// <reference path="unit.ts"/>


module Rance
{
  export interface TargetingFunction
  {
    (units: Unit[][], target: number[]): Unit[];
  }

  //**
  //**
  //X*
  //**
  export var targetSingle: TargetingFunction;
  targetSingle = function(units: Unit[][], target: number[])
  {
    return getFrom2dArray(units, [target]);
  };

  //XX
  //XX
  //XX
  //XX
  export var targetAll: TargetingFunction;
  targetAll = function(units: Unit[][], target: number[])
  {
    return flatten2dArray(units);
  };

  //**
  //**
  //XX
  //**
  export var targetRow: TargetingFunction;
  targetRow = function(units: Unit[][], target: number[])
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
  export var targetColumn: TargetingFunction;
  targetColumn = function(units: Unit[][], target: number[])
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
  export var targetColumnNeighbors: TargetingFunction;
  targetColumnNeighbors = function(units: Unit[][], target: number[])
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
  export var targetNeighbors: TargetingFunction;
  targetNeighbors = function(units: Unit[][], target: number[])
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
