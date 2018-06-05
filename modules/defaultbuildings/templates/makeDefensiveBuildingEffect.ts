import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";

import {bindEffectActionData} from "../../common/effectactiontemplates/effectActionBinding";
import
{
  adjustDefenderBattleEvaluationAdjustment,
} from "../../common/effectactiontemplates/effectActions";


export function makeDefensiveBuildingEffect(amount: number): UnitEffectTemplate
{
  return(
  {
    type: "defensiveBuildingAdvantage",
    isHidden: true,

    atBattleStart:
    [
      {
        id: "defensiveBuildingAdvantage",
        getUnitsInArea: () => [],
        executeAction: bindEffectActionData(adjustDefenderBattleEvaluationAdjustment,
        {
          amount: amount,
        }),
      },
    ],
  });
}
