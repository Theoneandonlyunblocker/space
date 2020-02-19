import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";


export const battleEndPhase: CombatPhaseInfo<CorePhase> =
{
  key: "battleEndPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    // TODO 2020.01.29 |
  },
  combatActionFetchers: {},
  combatListenerFetchers: {},
};
