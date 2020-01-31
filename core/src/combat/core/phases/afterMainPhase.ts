import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


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

    },
    combatListenerFetchers:
    {
      ...universalCoreListenerFetchers,
    },
  };
}
