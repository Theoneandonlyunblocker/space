import { CombatActionFetcher } from "../../CombatActionFetcher";
import { addInitialMoveDelay } from "../actions/addInitialMoveDelay";
import { battleStartPhase } from "../phases/battleStartPhase";


export const addMoveDelayAtBattleStart: CombatActionFetcher =
{
  key: "addMoveDelayAtBattleStart",
  phasesToApplyTo: new Set([battleStartPhase]),
  fetch: (battle) =>
  {
    const addMoveDelayActions = battle.getAllUnits().map(unit => addInitialMoveDelay(unit));

    return addMoveDelayActions;
  },
};
