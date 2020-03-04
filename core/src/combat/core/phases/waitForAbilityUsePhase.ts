import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export const waitForAbilityUsePhase: CombatPhaseInfo<CorePhase> =
{
  key: "waitForAbilityUsePhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase("beforeMainPhase");
  },
};
