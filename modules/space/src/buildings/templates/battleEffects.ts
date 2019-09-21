import {UnitEffectTemplate} from "core/src/templateinterfaces/UnitEffectTemplate";

import
{
  adjustDefenderBattleEvaluationAdjustment,
} from "modules/space/src/effectactions/effectActions";


export function makeDefenderAdvantageEffect(amount: number): UnitEffectTemplate
{
  return(
  {
    type: "defenderAdvantage",
    isHidden: true,

    atBattleStart:
    [
      {
        id: "defenderAdvantage",
        getUnitsInArea: () => [],
        executeAction: adjustDefenderBattleEvaluationAdjustment.bind(null,
        {
          amount: amount,
        }),
      },
    ],
  });
}
