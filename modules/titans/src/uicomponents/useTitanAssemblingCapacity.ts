import { makeTriggeredScriptHook } from "modules/defaultui/src/makeTriggeredScriptHook";
import { Star } from "core/src/map/Star";
import { getTitanAssemblingCapacity } from "../mapLevelModifiers";


const triggeredScriptHook = makeTriggeredScriptHook<Star, number>(star => getTitanAssemblingCapacity(star));

export const useTitanAssemblingCapacity = triggeredScriptHook.hook;
export const updateTitanAssemblingCapacity = triggeredScriptHook.updateHooks;
