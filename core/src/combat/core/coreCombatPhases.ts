import { afterMainPhase } from "./phases/afterMainPhase";
import { battleEndPhase } from "./phases/battleEndPhase";
import { battleStartPhase } from "./phases/battleStartPhase";
import { beforeMainPhase } from "./phases/beforeMainPhase";
import { mainPhase } from "./phases/mainPhase";
import { turnEndPhase } from "./phases/turnEndPhase";
import { turnStartPhase } from "./phases/turnStartPhase";
import { waitForAbilityUsePhase } from "./phases/waitForAbilityUsePhase";
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

export const coreCombatPhases: {[P in CorePhase]: CombatPhaseInfo<CorePhase>} =
{
  afterMainPhase: afterMainPhase,
  battleEndPhase: battleEndPhase,
  battleStartPhase: battleStartPhase,
  beforeMainPhase: beforeMainPhase,
  mainPhase: mainPhase,
  turnEndPhase: turnEndPhase,
  turnStartPhase: turnStartPhase,
  waitForAbilityUsePhase: waitForAbilityUsePhase,
};
