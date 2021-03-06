import {UnitArchetype} from "core/src/templateinterfaces/UnitArchetype";


export const combat: UnitArchetype =
{
  key: "combat",
  idealWeightInBattle: 1,
  idealWeightInFleet: 1,
  rowScores:
  {
    ROW_FRONT: 1,
    ROW_BACK: 0.6,
  },
};
export const utility: UnitArchetype =
{
  key: "utility",
  idealWeightInBattle: 0.33,
  idealWeightInFleet: 0.5,
  rowScores:
  {
    ROW_FRONT: 0.4,
    ROW_BACK: 0.6,
  },
};
export const scouting: UnitArchetype =
{
  key: "scouting",
  idealWeightInBattle: 0.01,
  idealWeightInFleet: 0.2,
  rowScores:
  {
    ROW_FRONT: 0.01,
    ROW_BACK: 0.02,
  },
};
export const defence: UnitArchetype =
{
  key: "defence",
  idealWeightInBattle: 0.5,
  idealWeightInFleet: 0.5,
  rowScores:
  {
    ROW_FRONT: 1,
    ROW_BACK: 0.5,
  },
  scoreMultiplierForRowFN: (row, rowUnits, enemyUnits, enemyFormation) =>
  {
    const multiplier = (row === "ROW_BACK" ? 0.7 : 1);

    const unitDefenceThreshhold = 6;
    const totalDefenceUnderThreshhold = rowUnits.filter(unit => Boolean(unit)).map(unit =>
    {
      const defenceUnderThreshhold = Math.max(unit.attributes.defence - unitDefenceThreshhold);

      return defenceUnderThreshhold;
    }).reduce((total, current) =>
    {
      return total + current;
    }, 0);

    return multiplier + totalDefenceUnderThreshhold * 0.2;
  },
};
export const economic: UnitArchetype =
{
  key: "economic",
  idealWeightInBattle: 0.01,
  idealWeightInFleet: 0.01,
  rowScores:
  {
    ROW_FRONT: 0.01,
    ROW_BACK: 0.02,
  },
};

export const unitArchetypes =
{
  [combat.key]: combat,
  [utility.key]: utility,
  [scouting.key]: scouting,
  [defence.key]: defence,
  [economic.key]: economic,
};
