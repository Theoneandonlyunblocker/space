import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleEndPhase } from "./battleEndPhase";
import { turnEndPhase } from "./turnEndPhase";


export const afterMainPhase: CombatPhaseInfo<CorePhase> =
{
  key: "afterMainPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    if (combatManager.battle.shouldEnd())
    {
      combatManager.setPhase(battleEndPhase);
    }
    else
    {
      combatManager.setPhase(turnEndPhase);
    }
  },
};
