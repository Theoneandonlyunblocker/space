import Battle from "./Battle";
import Unit from "./Unit";
import
{
  flatten2dArray,
  getFrom2dArray,
  reverseSide,
} from "./utility";

//------TARGETING
export interface GetBattleTargetsFN
{
  (user: Unit, battle: Battle): Unit[];
}
export const targetSelf: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return [user];
};
export const targetNextRow: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  const ownPosition = user.battleStats.position;
  const increment = user.battleStats.side === "side1" ? 1 : -1;

  const fullFormation = battle.side1.concat(battle.side2);

  return fullFormation[ownPosition[0] + increment].filter(unit => unit !== null);
};
export const targetAllies: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return battle.getUnitsForSide(user.battleStats.side);
};
export const targetEnemies: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return battle.getUnitsForSide(reverseSide(user.battleStats.side));
};
export const targetAll: GetBattleTargetsFN = function(user: Unit, battle: Battle)
{
  return flatten2dArray(battle.side1.concat(battle.side2)).filter(unit => unit !== null);
};

//------AREAS
export interface GetUnitsInAreaFN
{
  (user: Unit, target: Unit, battle: Battle): (Unit | null)[];
}
//**
//**
//X*
//**
export const areaSingle: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  return [target];
};

//XX
//XX
//XX
//XX
export const areaAll: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  return flatten2dArray(battle.side1.concat(battle.side2));
};

//**
//**
//XX
//**
export const areaColumn: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  const allRows = battle.side1.concat(battle.side2);
  const y = target.battleStats.position[1];

  return allRows.map(row => row[y]);
};

//X*
//X*
//X*
//X*
export const areaRow: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  const allRows = battle.side1.concat(battle.side2);
  const x = target.battleStats.position[0];

  return allRows[x];
};

//**
//X*
//X*
//X*
export const areaRowNeighbors: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  const row = areaRow(user, target, battle);

  const y = target.battleStats.position[1];
  const y1 = Math.max(y - 1, 0);
  const y2 = Math.min(y + 1, row.length - 1);

  return row.slice(y1, y2);
};

//**
//X*
//XX
//X*
export const areaOrthogonalNeighbors: GetUnitsInAreaFN = function(user: Unit, target: Unit, battle: Battle)
{
  const allRows = battle.side1.concat(battle.side2);
  const x = target.battleStats.position[0];
  const y = target.battleStats.position[1];

  const targetLocations: number[][] = [];

  targetLocations.push([x, y]);
  targetLocations.push([x-1, y]);
  targetLocations.push([x+1, y]);
  targetLocations.push([x, y-1]);
  targetLocations.push([x, y+1]);

  return getFrom2dArray(allRows, targetLocations);
};
