import {UnitEffectTemplate} from "src/templateinterfaces/UnitEffectTemplate";

import
{
  adjustDefenderBattleEvaluationAdjustment,
} from "modules/space/effectactions/effectActions";


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
