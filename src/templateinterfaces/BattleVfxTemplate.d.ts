import * as PIXI from "pixi.js";

import {VfxParams} from "./VfxParams";

export interface BattleVfxTemplate
{
  duration: number;
  vfxWillTriggerEffect?: boolean; // true if one of the vfx functions calls VfxParams.triggerEffect()
  userSprite?: (props: VfxParams) => void;
  enemySprite?: (props: VfxParams) => void;
  userOverlay?: (props: VfxParams) => void;
  enemyOverlay?: (props: VfxParams) => void;
  // emptySpaceOverlay?: (props: VfxParams) => void;
  battleOverlay?: (props: VfxParams) => void;
}
