import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";

import {bindEffectActionData} from "../../common/effectactiontemplates/effectActionBinding";
import
{
  adjustDefenderBattleEvaluationAdjustment,
} from "../../common/effectactiontemplates/effectActions";


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
        executeAction: bindEffectActionData(adjustDefenderBattleEvaluationAdjustment,
        {
          amount: amount,
        }),
      },
    ],
  });
}
