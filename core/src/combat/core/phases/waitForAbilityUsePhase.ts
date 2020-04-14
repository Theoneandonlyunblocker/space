import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { beforeMainPhase } from "./beforeMainPhase";


export const waitForAbilityUsePhase: CombatPhaseInfo<CorePhase> =
{
  key: "waitForAbilityUsePhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(beforeMainPhase);
  },
};
