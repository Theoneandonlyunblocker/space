import * as PIXI from "pixi.js";

import {VfxDrawingFunction} from "./VfxDrawingFunction";


export interface BattleVfxTemplate
{
  key: string;
  duration: number;
  vfxWillTriggerEffect?: boolean; // set to true if the vfx functions will trigger all ability use effects
  userSprite?: VfxDrawingFunction;
  enemySprite?: VfxDrawingFunction;
  userOverlay?: VfxDrawingFunction;
  enemyOverlay?: VfxDrawingFunction;
  battleOverlay?: VfxDrawingFunction;
}
