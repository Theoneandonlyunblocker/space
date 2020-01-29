import { CombatPhaseInfo } from "../CombatPhaseInfo";
import { CorePhase } from "./allCorePhases";


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
