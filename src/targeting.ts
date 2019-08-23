import
{
  AbilityTargetDisplayDataById,
  AbilityTargetEffect,
  AbilityTargetType,
} from "./AbilityTargetDisplayData";
import {Battle} from "./Battle";
import {Unit} from "./Unit";
import
{
  flatten2dArray,
  getFrom2dArray,
  reverseSide,
} from "./utility";


// ------TARGETING
export type GetBattleTargetsFN = (user: Unit, battle: Battle) => Unit[];
export const targetSelf: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  return [user];
};
export const targetNextRow: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  const ownPosition = user.battleStats.position;
  const increment = user.battleStats.side === "side1" ? 1 : -1;

  const fullFormation = battle.side1.concat(battle.side2);

  return fullFormation[ownPosition[0] + increment];
};
export const targetAllAllies: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  return battle.getUnitsForSide(user.battleStats.side);
};
export const targetOtherAllies: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  return targetAllAllies(user, battle).filter(unit => unit !== user);
}
export const targetEnemies: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  return battle.getUnitsForSide(reverseSide(user.battleStats.side));
};
export const targetAll: GetBattleTargetsFN = (user: Unit, battle: Battle) =>
{
  return flatten2dArray(battle.side1.concat(battle.side2));
};

// ------AREAS
export type GetUnitsInAreaFN<T = (Unit | null)[]> = (
  user: Unit,
  target: Unit,
  battle: Battle,
) => T;

// **
// **
// X*
// **
export const areaSingle: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  return [target];
};

// XX
// XX
// XX
// XX
export const areaAll: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  return flatten2dArray(battle.side1.concat(battle.side2));
};

// **
// **
// XX
// **
export const areaColumn: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  const allRows = battle.side1.concat(battle.side2);
  const y = target.battleStats.position[1];

  return allRows.map(row => row[y]);
};

// X*
// X*
// X*
// X*
export const areaRow: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  const allRows = battle.side1.concat(battle.side2);
  const x = target.battleStats.position[0];

  return allRows[x];
};

// **
// X*
// X*
// X*
export const areaRowNeighbors: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  const row = areaRow(user, target, battle);

  const y = target.battleStats.position[1];
  const y1 = Math.max(y - 1, 0);
  const y2 = Math.min(y + 1, row.length - 1);

  return row.slice(y1, y2 + 1);
};

// **
// X*
// XX
// X*
export const areaOrthogonalNeighbors: GetUnitsInAreaFN = (user: Unit, target: Unit, battle: Battle) =>
{
  const allRows = battle.side1.concat(battle.side2);
  const x = target.battleStats.position[0];
  const y = target.battleStats.position[1];

  const targetLocations: number[][] = [];

  targetLocations.push([x,     y    ]);
  targetLocations.push([x - 1, y    ]);
  targetLocations.push([x + 1, y    ]);
  targetLocations.push([x,     y - 1]);
  targetLocations.push([x,     y + 1]);

  return getFrom2dArray(allRows, targetLocations);
};


export function makeGetAbilityTargetDisplayDataFN(props:
{
  areaFN: GetUnitsInAreaFN;
  targetType: AbilityTargetType;
  targetEffect: AbilityTargetEffect;
}): GetUnitsInAreaFN<AbilityTargetDisplayDataById>
{
  return (user: Unit, target: Unit, battle: Battle) =>
  {
    const unitsInArea = props.areaFN(user, target, battle);

    const displayDataById: AbilityTargetDisplayDataById = {};

    unitsInArea.forEach(unit =>
    {
      displayDataById[unit.id] =
      {
        targetType: props.targetType,
        targetEffect: props.targetEffect,
      };
    });

    return displayDataById;
  };
}
