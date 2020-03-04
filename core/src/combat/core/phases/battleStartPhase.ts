import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export const battleStartPhase: CombatPhaseInfo<CorePhase> =
{
  key: "battleStartPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase("turnStartPhase");
  },
};
