import * as PIXI from "pixi.js";

import {VfxDrawingFunction} from "../VfxDrawingFunction";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export interface BattleVfxTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any>
{
  duration: number;
  vfxWillTriggerEffect?: boolean; // true if one of the vfx functions will trigger // TODO 2019.08.22 | name this
  userSprite?: VfxDrawingFunction<EffectId, R>;
  enemySprite?: VfxDrawingFunction<EffectId, R>;
  userOverlay?: VfxDrawingFunction<EffectId, R>;
  enemyOverlay?: VfxDrawingFunction<EffectId, R>;
  battleOverlay?: VfxDrawingFunction<EffectId, R>;
}
