import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export function turnEndPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "turnEndPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("turnStartPhase");
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
