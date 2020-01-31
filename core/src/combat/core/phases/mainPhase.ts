import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


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

    },
    combatListenerFetchers:
    {
      ...universalCoreListenerFetchers,
    },
  };
}
