import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export const beforeMainPhase: CombatPhaseInfo<CorePhase> =
{
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
