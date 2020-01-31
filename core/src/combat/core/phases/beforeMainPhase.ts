import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


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

    },
    combatListenerFetchers:
    {
      ...universalCoreListenerFetchers,
    },
  };
}
