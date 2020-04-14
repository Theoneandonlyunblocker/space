import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleEndPhase } from "./battleEndPhase";
import { mainPhase } from "./mainPhase";


export const beforeMainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "beforeMainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    if (combatManager.battle.shouldEnd())
    {
      combatManager.setPhase(battleEndPhase);
    }
    else
    {
      combatManager.setPhase(mainPhase);
    }
  },
};
