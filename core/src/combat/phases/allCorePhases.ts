import { afterMainPhase } from "./afterMainPhase";
import { battleEndPhase } from "./battleEndPhase";
import { battleStartPhase } from "./battleStartPhase";
import { beforeMainPhase } from "./beforeMainPhase";
import { mainPhase } from "./mainPhase";
import { turnEndPhase } from "./turnEndPhase";
import { turnStartPhase } from "./turnStartPhase";
import { waitForAbilityUsePhase } from "./waitForAbilityUsePhase";
import { CombatPhaseInfo } from "../CombatPhaseInfo";


export type CorePhase =
  "afterMainPhase" |
  "battleEndPhase" |
  "battleStartPhase" |
  "beforeMainPhase" |
  "mainPhase" |
  "turnEndPhase" |
  "turnStartPhase" |
  "waitForAbilityUsePhase";

export function getAllCorePhaseInfo(): {[P in CorePhase]: CombatPhaseInfo<CorePhase>}
{
  return {
    afterMainPhase: afterMainPhase(),
    battleEndPhase: battleEndPhase(),
    battleStartPhase: battleStartPhase(),
    beforeMainPhase: beforeMainPhase(),
    mainPhase: mainPhase(),
    turnEndPhase: turnEndPhase(),
    turnStartPhase: turnStartPhase(),
    waitForAbilityUsePhase: waitForAbilityUsePhase(),
  };
}
