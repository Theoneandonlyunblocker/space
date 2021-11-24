import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { turnEndPhase } from "./turnEndPhase";


export const afterMainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "afterMainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase(turnEndPhase);
  },
};
