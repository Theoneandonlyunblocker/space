import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";

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
        executeAction: adjustDefenderBattleEvaluationAdjustment.bind(null,
        {
          amount: amount,
        }),
      },
    ],
  });
}
