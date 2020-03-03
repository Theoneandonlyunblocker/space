import { CombatPhaseInfo } from "../../CombatPhaseInfo";
import { CorePhase } from "../coreCombatPhases";
import { addMoveDelayAtBattleStart } from "../actionFetchers/addMoveDelayAtBattleStart";


export const battleStartPhase: CombatPhaseInfo<CorePhase> =
{
  key: "battleStartPhase",
  defaultPhaseFinishCallback: (combatManager) =>
  {
    combatManager.setPhase("turnStartPhase");
  },
  combatActionFetchers:
  {
    addMoveDelayAtBattleStart: addMoveDelayAtBattleStart,
  },
  combatListenerFetchers: {},
};
