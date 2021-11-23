import { addInitialMoveDelayToAllUnits } from "./actionFetchers/addInitialMoveDelayToAllUnits";
import { universalCoreListenerFetchers } from "./universalCoreListenerFetchers";


export const coreCombatActionListenerFetchers =
{
  [universalCoreListenerFetchers.key]: universalCoreListenerFetchers,
};

export const coreCombatActionFetchers =
{
  [addInitialMoveDelayToAllUnits.key]: addInitialMoveDelayToAllUnits,
};
