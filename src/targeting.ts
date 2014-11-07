/// <reference path="utility.ts"/>
/// <reference path="unit.ts"/>


module Rance
{
  export interface TargetingFunction
  {
    (fleets: Unit[][], target: number[]): Unit[];
  }

  //**
  //**
  //X*
  //**
  export var targetSingle: TargetingFunction;
  targetSingle = function(fleets: Unit[][], target: number[])
  {
    return getFrom2dArray(fleets, [target]);
  };

  //XX
  //XX
  //XX
  //XX
  export var targetAll: TargetingFunction;
  targetAll = function(fleets: Unit[][], target: number[])
  {
    var allTargets = [];

    for (var i = 0; i < fleets.length; i++)
    {
      for (var j = 0; j < fleets[i].length; j++)
      {
        allTargets.push(fleets[i][j]);
      }
    }

    return allTargets;
  };

  //**
  //**
  //XX
  //**
  export var targetRow: TargetingFunction;
  targetRow = function(fleets: Unit[][], target: number[])
  {
    var y = target[1];
    var allTargets = [];

    for (var i = 0; i < fleets.length; i++)
    {
      allTargets.push([i,y]);
    }

    return getFrom2dArray(fleets, allTargets);
  };

  //X*
  //X*
  //X*
  //X*
  export var targetColumn: TargetingFunction;
  targetColumn = function(fleets: Unit[][], target: number[])
  {
    var x = target[0];
    var allTargets = [];

    for (var i = 0; i < fleets[x].length; i++)
    {
      allTargets.push([x,i]);
    }

    return getFrom2dArray(fleets, allTargets);
  };

  //**
  //X*
  //X*
  //X*
  export var targetColumnNeighbors: TargetingFunction;
  targetColumnNeighbors = function(fleets: Unit[][], target: number[])
  {
    var x = target[0];
    var y = target[1];
    var allTargets = [];

    allTargets.push([x, y-1]);
    allTargets.push([x, y+1]);

    return getFrom2dArray(fleets, allTargets);
  };

  //**
  //X*
  //XX
  //X*
  export var targetNeighbors: TargetingFunction;
  targetNeighbors = function(fleets: Unit[][], target: number[])
  {
    var x = target[0];
    var y = target[1];
    var allTargets = [];

    allTargets.push([x, y]);
    allTargets.push([x-1, y]);
    allTargets.push([x+1, y]);
    allTargets.push([x, y-1]);
    allTargets.push([x, y+1]);

    console.log(target, allTargets);

    return getFrom2dArray(fleets, allTargets);
  };
}
