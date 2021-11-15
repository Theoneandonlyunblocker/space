import { BuildingBattlePrepEffectWithAdjustment } from "core/src/battleprep/BuildingBattlePrepEffect";
import { battleStartPhase } from "core/src/combat/core/phases/battleStartPhase";
import { changeBattleEvaluation } from "modules/baselib/src/combat/actions/changeBattleEvaluation";


export function makeDefenderAdvantageEffect(amount: number): BuildingBattlePrepEffectWithAdjustment
{
  return {
    adjustment: {flat: amount},
    effect:
    {
      onBattlePrepStart: (strength, building, battlePrep) =>
      {
        const sideOfBuildingController = battlePrep.getBattleSideForPlayer(building.controller);

        const sign = sideOfBuildingController === "side1" ? 1 : -1;
        const adjustmentAmount = strength * sign;

        const adjustBattleEvaluationAction = changeBattleEvaluation(adjustmentAmount);
        battlePrep.combatManager.addAction(battleStartPhase, adjustBattleEvaluationAction);
      },
    },
  };
}
