import * as PIXI from "pixi.js";

import {VfxDrawingFunction} from "../VfxDrawingFunction";


export interface BattleVfxTemplate
{
  duration: number;
  vfxWillTriggerEffect?: boolean; // true if one of the vfx functions will trigger // TODO 2019.08.22 | name this
  userSprite?: VfxDrawingFunction;
  enemySprite?: VfxDrawingFunction;
  userOverlay?: VfxDrawingFunction;
  enemyOverlay?: VfxDrawingFunction;
  battleOverlay?: VfxDrawingFunction;
}
