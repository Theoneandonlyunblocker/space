import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleEndPhase } from "./battleEndPhase";
import { afterMainPhase } from "./afterMainPhase";


export const mainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "mainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    if (combatManager.battle.shouldEnd())
    {
      combatManager.setPhase(battleEndPhase);
    }
    else
    {
      combatManager.setPhase(afterMainPhase);
    }
  },
};
