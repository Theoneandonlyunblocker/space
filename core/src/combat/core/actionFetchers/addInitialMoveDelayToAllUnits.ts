import { CombatActionFetcher } from "../../CombatActionFetcher";
import { addInitialMoveDelay } from "../actions/addInitialMoveDelay";
import { battleInitPhase } from "../phases/battleInitPhase";


export const addInitialMoveDelayToAllUnits: CombatActionFetcher =
{
  key: "addInitialMoveDelayToAllUnits",
  phasesToApplyTo: new Set([battleInitPhase]),
  fetch: (battle) =>
  {
    const addMoveDelayActions = battle.getAllUnits().map(unit => addInitialMoveDelay(unit));

    return addMoveDelayActions;
  },
};
