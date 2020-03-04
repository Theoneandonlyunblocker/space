import { applyAttackAndDefenceToAttacks } from "./actionListeners/applyAttackAndDefenceToAttacks";
import { applyGuardDamageReductionToAttacks } from "./actionListeners/applyGuardDamageReductionToAttacks";
import { applyIntelligenceToAttacks } from "./actionListeners/applyIntelligenceToAttacks";
import { applySpeedToMoveDelay } from "./actionListeners/applySpeedToMoveDelay";
import { CombatActionListenerFetcher } from "../CombatActionFetcher";
import { CorePhase } from "./coreCombatPhases";
import { afterMainPhase } from "./phases/afterMainPhase";
import { beforeMainPhase } from "./phases/beforeMainPhase";
import { mainPhase } from "./phases/mainPhase";
import { turnEndPhase } from "./phases/turnEndPhase";
import { turnStartPhase } from "./phases/turnStartPhase";


export const universalCoreListenerFetchers: CombatActionListenerFetcher<CorePhase> =
{
  key: "universalCoreListenerFetchers",
  phasesToApplyTo: new Set(
  [
    afterMainPhase,
    beforeMainPhase,
    mainPhase,
    turnEndPhase,
    turnStartPhase,
  ]),
  fetch: () =>
  [
    applyAttackAndDefenceToAttacks,
    applyGuardDamageReductionToAttacks,
    applyIntelligenceToAttacks,
    applySpeedToMoveDelay,
  ],
};
