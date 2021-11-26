import { applyAttackAndDefenceToAttacks } from "./actionListeners/applyAttackAndDefenceToAttacks";
import { applyGuardDamageReductionToAttacks } from "./actionListeners/applyGuardDamageReductionToAttacks";
import { applyIntelligenceToAttacks } from "./actionListeners/applyIntelligenceToAttacks";
import { applySpeedToMoveDelay } from "./actionListeners/applySpeedToMoveDelay";
import { removeGuardOnAbilityUse } from "./actionListeners/removeGuardOnAbilityUse";


export const coreGlobalActionListeners =
[
  applyAttackAndDefenceToAttacks,
  applyGuardDamageReductionToAttacks,
  applyIntelligenceToAttacks,
  applySpeedToMoveDelay,
  removeGuardOnAbilityUse,
];
