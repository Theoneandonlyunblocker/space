import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export function turnStartPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "turnStartPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      if (combatManager.battle.shouldEnd())
      {
        combatManager.setPhase("battleEndPhase");
      }
      else
      {
        combatManager.setPhase("waitForAbilityUsePhase");
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
