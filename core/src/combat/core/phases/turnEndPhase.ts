import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { universalCoreListenerFetchers } from "../universalCoreListenerFetchers";


export const turnEndPhase: CombatPhaseInfo<CorePhase> =
{
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
