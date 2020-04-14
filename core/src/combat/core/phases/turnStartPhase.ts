import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { battleEndPhase } from "./battleEndPhase";
import { waitForAbilityUsePhase } from "./waitForAbilityUsePhase";


export const turnStartPhase: CombatPhaseInfo<CorePhase> =
{
  key: "turnStartPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    if (combatManager.battle.shouldEnd())
    {
      combatManager.setPhase(battleEndPhase);
    }
    else
    {
      combatManager.setPhase(waitForAbilityUsePhase);
    }
  },
};
