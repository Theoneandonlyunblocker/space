import * as PIXI from "pixi.js";

import {SfxParams} from "./SfxParams";

export interface BattleSfxTemplate
{
  duration: number;
  sfxWillTriggerEffect?: boolean; // true if one of the sfx functions calls SfxParams.triggerEffect()
  userSprite?: (props: SfxParams) => void;
  enemySprite?: (props: SfxParams) => void;
  userOverlay?: (props: SfxParams) => void;
  enemyOverlay?: (props: SfxParams) => void;
  // emptySpaceOverlay?: (props: SfxParams) => void;
  battleOverlay?: (props: SfxParams) => void;
}
