import * as PIXI from "pixi.js";

import {VfxParams} from "./VfxParams";

export interface BattleVfxTemplate
{
  duration: number;
  vfxWillTriggerEffect?: boolean; // true if one of the vfx functions will trigger // TODO 2019.08.22 | name this
  userSprite?: (props: VfxParams) => void;
  enemySprite?: (props: VfxParams) => void;
  userOverlay?: (props: VfxParams) => void;
  enemyOverlay?: (props: VfxParams) => void;
  battleOverlay?: (props: VfxParams) => void;
}
