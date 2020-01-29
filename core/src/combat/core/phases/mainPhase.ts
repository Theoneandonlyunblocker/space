import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export function mainPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "mainPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("afterMainPhase");
      }
    },
    combatActionFetchers:
    {
      // global effects
      // battle effects
      // unit effects
      //  items
      //  statuses
      //  passives
    },
    combatListenerFetchers:
    {

    },
  };
}
