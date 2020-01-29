import { CombatPhaseInfo } from "../CombatPhaseInfo";
import { CorePhase } from "./allCorePhases";


export function waitForAbilityUsePhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "waitForAbilityUsePhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      combatManager.setPhase("beforeMainPhase");
    },
    combatActionFetchers: {},
    combatListenerFetchers: {},
  };
}
