import { CombatPhaseInfo } from "../CombatPhaseInfo";
import { CorePhase } from "./allCorePhases";


export function beforeMainPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "beforeMainPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("mainPhase");
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
