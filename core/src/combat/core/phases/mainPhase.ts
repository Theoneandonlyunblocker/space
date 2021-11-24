import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { afterMainPhase } from "./afterMainPhase";


export const mainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "mainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(afterMainPhase);
  },
};
