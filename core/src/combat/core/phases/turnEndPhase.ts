import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleEndPhase } from "./battleEndPhase";
import { turnStartPhase } from "./turnStartPhase";


export const turnEndPhase: CombatPhaseInfo<CorePhase> =
{
  key: "turnEndPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    if (combatManager.battle.shouldEnd())
    {
      combatManager.setPhase(battleEndPhase);
    }
    else
    {
      combatManager.setPhase(turnStartPhase);
    }
  },
};
