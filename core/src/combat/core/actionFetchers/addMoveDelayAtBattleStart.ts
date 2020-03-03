import { CombatActionFetcher } from "../../CombatActionFetcher";
import { addInitialMoveDelay } from "../actions/addInitialMoveDelay";


export const addMoveDelayAtBattleStart: CombatActionFetcher = (battle) =>
{
  const addMoveDelayActions = battle.getAllUnits().map(unit => addInitialMoveDelay(unit));

  return addMoveDelayActions;
};
