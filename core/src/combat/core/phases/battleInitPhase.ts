import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleStartPhase } from "./battleStartPhase";


export const battleInitPhase: CombatPhaseInfo<CorePhase> =
{
  key: "battleInitPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(battleStartPhase);
  },
};
