import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export function battleStartPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "battleStartPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      combatManager.setPhase("turnStartPhase");
    },
    combatActionFetchers: {},
    combatListenerFetchers: {},
  };
}
