import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export const turnStartPhase: CombatPhaseInfo<CorePhase> =
{
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
