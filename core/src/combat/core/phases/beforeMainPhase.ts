import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { mainPhase } from "./mainPhase";


export const beforeMainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "beforeMainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(mainPhase);
  },
};
