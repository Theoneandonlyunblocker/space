import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { waitForAbilityUsePhase } from "./waitForAbilityUsePhase";


export const turnStartPhase: CombatPhaseInfo<CorePhase> =
{
  key: "turnStartPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(waitForAbilityUsePhase);
  },
};
