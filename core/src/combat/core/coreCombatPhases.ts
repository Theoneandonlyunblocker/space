import { afterMainPhase } from "./phases/afterMainPhase";
import { battleEndPhase } from "./phases/battleEndPhase";
import { battleStartPhase } from "./phases/battleStartPhase";
import { beforeMainPhase } from "./phases/beforeMainPhase";
import { mainPhase } from "./phases/mainPhase";
import { turnEndPhase } from "./phases/turnEndPhase";
import { turnStartPhase } from "./phases/turnStartPhase";
import { waitForAbilityUsePhase } from "./phases/waitForAbilityUsePhase";
import { CombatPhaseInfo } from "../CombatPhaseInfo";
import { battleInitPhase } from "./phases/battleInitPhase";


export type CorePhase =
  "battleInitPhase" |
  "battleStartPhase" |
  "turnStartPhase" |
  "beforeMainPhase" |
  "mainPhase" |
  "afterMainPhase" |
  "turnEndPhase" |
  "battleEndPhase" |

  "waitForAbilityUsePhase";

export const coreCombatPhases: {[P in CorePhase]: CombatPhaseInfo<CorePhase>} =
{
  // for setting up internal-ish things (f.ex. add initial move delay to all units)
  battleInitPhase: battleInitPhase,
  // for stuff the user has agency over (f.ex. add 1 turn of weak to all enemies at start of battle)
  battleStartPhase: battleStartPhase,
  turnStartPhase: turnStartPhase,
  waitForAbilityUsePhase: waitForAbilityUsePhase,
  beforeMainPhase: beforeMainPhase,
  mainPhase: mainPhase,
  afterMainPhase: afterMainPhase,
  turnEndPhase: turnEndPhase,
  battleEndPhase: battleEndPhase,
};

export const allCoreCombatPhases: CombatPhaseInfo<CorePhase>[] = Object.keys(coreCombatPhases).map(key => coreCombatPhases[key]);
