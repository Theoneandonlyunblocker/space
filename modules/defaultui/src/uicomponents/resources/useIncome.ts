import { Resources } from "core/src/player/PlayerResources";
import { Player } from "core/src/player/Player";
import { makeTriggeredScriptHook } from "../../makeTriggeredScriptHook";


const triggeredScriptHook = makeTriggeredScriptHook<Player, Resources>(
  player => player.getResourceIncome(),
);

export const useIncome = triggeredScriptHook.hook;
export const updateIncome = triggeredScriptHook.updateHooks;
