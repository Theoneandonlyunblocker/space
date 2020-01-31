import { applyAttackAndDefenceToAttacks } from "./actionListeners/applyAttackAndDefenceToAttacks";
import { applyGuardDamageReductionToAttacks } from "./actionListeners/applyGuardDamageReductionToAttacks";
import { applyIntelligenceToAttacks } from "./actionListeners/applyIntelligenceToAttacks";
import { applySpeedToMoveDelay } from "./actionListeners/applySpeedToMoveDelay";


export const universalCoreListenerFetchers =
{
  [applyAttackAndDefenceToAttacks.key]: () => [applyAttackAndDefenceToAttacks],
  [applyGuardDamageReductionToAttacks.key]: () => [applyGuardDamageReductionToAttacks],
  [applyIntelligenceToAttacks.key]: () => [applyIntelligenceToAttacks],
  [applySpeedToMoveDelay.key]: () => [applySpeedToMoveDelay],
};
