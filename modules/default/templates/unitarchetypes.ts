/// <reference path="../../../src/templateinterfaces/iunitarchetype.d.ts"/>

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace UnitArchetypes
        {
          export var combat: UnitArchetype =
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
          export var utility: UnitArchetype =
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
          export var scouting: UnitArchetype =
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
          export var defence: UnitArchetype =
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
              var totalDefenceUnderThreshhold = 0;
              var threshhold = 6;
              var alreadyHasDefender = false;

              for (var i = 0; i < rowUnits.length; i++)
              {
                var unit = rowUnits[i];
                if (!unit) continue
                
                if (unit.template.archetype.type === "defence")
                {
                  return multiplier;
                }

                totalDefenceUnderThreshhold += Math.max(0, threshhold - unit.attributes.defence);
              }

              return multiplier + totalDefenceUnderThreshhold * 0.2;
            }
          }
        }
      }
    }
  }
}
