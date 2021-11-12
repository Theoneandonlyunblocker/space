import { applyAttackAndDefenceToAttacks } from "./actionListeners/applyAttackAndDefenceToAttacks";
import { applyGuardDamageReductionToAttacks } from "./actionListeners/applyGuardDamageReductionToAttacks";
import { applyIntelligenceToAttacks } from "./actionListeners/applyIntelligenceToAttacks";
import { applySpeedToMoveDelay } from "./actionListeners/applySpeedToMoveDelay";
import { CombatActionListenerFetcher } from "../CombatActionFetcher";
import { allCoreCombatPhases, CorePhase } from "./coreCombatPhases";


export const universalCoreListenerFetchers: CombatActionListenerFetcher<CorePhase> =
{
  key: "universalCoreListenerFetchers",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  fetch: () =>
  [
    applyAttackAndDefenceToAttacks,
    applyGuardDamageReductionToAttacks,
    applyIntelligenceToAttacks,
    applySpeedToMoveDelay,
  ],
};
