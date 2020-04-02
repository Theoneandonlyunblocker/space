import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const battleEvaluationChanged: CombatActionResultTemplate<number> =
{
  key: "battleEvaluationChanged",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager) =>
  {
    combatManager.battle.evaluationAdjustment += value;
  },
};
