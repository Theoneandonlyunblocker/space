import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";

import
{
  adjustDefenderBattleEvaluationAdjustment,
  bindEffectActionData,
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
  })
};
