import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export function battleEndPhase(): CombatPhaseInfo<CorePhase>
{
  return {
    key: "battleEndPhase",
    defaultPhaseFinishCallback: (combatManager) =>
    {
      // TODO 2020.01.29 |
    },
    combatActionFetchers: {},
    combatListenerFetchers: {},
  };
}
