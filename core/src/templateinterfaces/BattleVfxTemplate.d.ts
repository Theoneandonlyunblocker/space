import * as PIXI from "pixi.js";

import {VfxDrawingFunction} from "./VfxDrawingFunction";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export interface BattleVfxTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any>
{
  duration: number;
  vfxWillTriggerEffect?: boolean; // set to true if the vfx functions will trigger all ability use effects
  userSprite?: VfxDrawingFunction<EffectId, R>;
  enemySprite?: VfxDrawingFunction<EffectId, R>;
  userOverlay?: VfxDrawingFunction<EffectId, R>;
  enemyOverlay?: VfxDrawingFunction<EffectId, R>;
  battleOverlay?: VfxDrawingFunction<EffectId, R>;
}
