import Battle from "./Battle";
import Unit from "./Unit";
import
{
  flatten2dArray,
  getFrom2dArray,
  reverseSide,
} from "./utility";

export enum TargetFormation
{
  ally = 0,
  enemy = 1,
  either = 2
}

export interface GetBattleTargetsFN
{
  (user: Unit, battle: Battle): Unit[];
}
export const targetSelf: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return [user];
}
export const targetNextRow: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  const ownPosition = user.battleStats.position;
  const increment = user.battleStats.side === "side1" ? 1 : -1;

  const fullFormation = battle.side1.concat(battle.side2);

  return fullFormation[ownPosition[0] + increment];
}
export const targetAllies: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return battle.getUnitsForSide(user.battleStats.side);
}
export const targetEnemies: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return battle.getUnitsForSide(reverseSide(user.battleStats.side));
}
export const targetAll: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return flatten2dArray(battle.side1.concat(battle.side2));
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
export var areaColumn: BattleAreaFunction = function(units: Unit[][], target: number[])
{
  var y = target[1];
  var targetLocations: number[][] = [];

  for (let i = 0; i < units.length; i++)
  {
    targetLocations.push([i,y]);
  }

  return getFrom2dArray(units, targetLocations);
};

//X*
//X*
//X*
//X*
export var areaRow: BattleAreaFunction = function(units: Unit[][], target: number[])
{
  var x = target[0];
  var targetLocations: number[][] = [];

  for (let i = 0; i < units[x].length; i++)
  {
    targetLocations.push([x,i]);
  }

  return getFrom2dArray(units, targetLocations);
};

//**
//X*
//X*
//X*
export var areaRowNeighbors: BattleAreaFunction = function(units: Unit[][], target: number[])
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
