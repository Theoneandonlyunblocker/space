import { Player } from "core/src/player/Player";
import { makeTriggeredScriptHook } from "../../makeTriggeredScriptHook";


const triggeredScriptHook = makeTriggeredScriptHook<Player, number>(
  player => player.playerTechnology.getResearchSpeed(),
);

export const useResearchSpeed = triggeredScriptHook.hook;
export const updateResearchSpeed = triggeredScriptHook.updateHooks;
