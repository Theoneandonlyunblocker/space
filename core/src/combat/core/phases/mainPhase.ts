import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export const mainPhase: CombatPhaseInfo<CorePhase> =
{
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
