import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitArchetype from "../../src/templateinterfaces/UnitArchetype";

import Unit from "../../src/Unit";

export const combat: UnitArchetype =
{
  type: "combat",
  idealWeightInBattle: 1,
  idealWeightInFleet: 1,
  rowScores:
  {
    ROW_FRONT: 1,
    ROW_BACK: 0.6
  }
}
export const utility: UnitArchetype =
{
  type: "utility",
  idealWeightInBattle: 0.33,
  idealWeightInFleet: 0.5,
  rowScores:
  {
    ROW_FRONT: 0.4,
    ROW_BACK: 0.6
  }
}
export const scouting: UnitArchetype =
{
  type: "scouting",
  idealWeightInBattle: 0.01,
  idealWeightInFleet: 0.2,
  rowScores:
  {
    ROW_FRONT: 0.01,
    ROW_BACK: 0.02
  }
}
export const defence: UnitArchetype =
{
  type: "defence",
  idealWeightInBattle: 0.5,
  idealWeightInFleet: 0.5,
  rowScores:
  {
    ROW_FRONT: 1,
    ROW_BACK: 0.5
  },
  scoreMultiplierForRowFN: function(row: string, rowUnits: Unit[], enemyUnits: Unit[])
  {
    var multiplier = (row === "ROW_BACK" ? 0.7 : 1);

    const unitDefenceThreshhold = 6;
    const totalDefenceUnderThreshhold = rowUnits.filter((unit) => Boolean(unit)).map(unit =>
    {
      const defenceUnderThreshhold = Math.max(unit.attributes.defence - unitDefenceThreshhold);

      return defenceUnderThreshhold;
    }).reduce((total, current) =>
    {
      return total + current;
    }, 0);

    return multiplier + totalDefenceUnderThreshhold * 0.2;
  }
}

const UnitArchetypes: TemplateCollection<UnitArchetype> =
{
  [combat.type]: combat,
  [utility.type]: utility,
  [scouting.type]: scouting,
  [defence.type]: defence,
}

export default UnitArchetypes;
