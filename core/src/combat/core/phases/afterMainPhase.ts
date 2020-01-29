import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export function afterMainPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "afterMainPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("turnEndPhase");
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
