import { Resources } from "core/src/player/PlayerResources";
import { Player } from "core/src/player/Player";
import { makeTriggeredScriptHook } from "../../makeTriggeredScriptHook";


const triggeredScriptHook = makeTriggeredScriptHook<Player, Resources>(
  player => ({...player.resources}),
);

export const useResources = triggeredScriptHook.hook;
export const updateResources = triggeredScriptHook.updateHooks;
// vvv legacy to maintain compat with mixin stuff vvv
export const getUpdaterId = triggeredScriptHook.getUpdaterId;
export const updaters = triggeredScriptHook.updaters;
// ^^^ legacy ^^^
