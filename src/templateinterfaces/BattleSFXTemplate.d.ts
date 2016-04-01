/// <reference path="../../lib/pixi.d.ts" />

/// <reference path="sfxparams.d.ts" />
import SFXParams from "./SFXParams.d.ts";

declare interface BattleSFXTemplate
{
  duration: number;
  SFXWillTriggerEffect?: boolean; // true if one of the sfx functions calls SFXParams.triggerEffect()
  userSprite?: (props: SFXParams) => void;
  enemySprite?: (props: SFXParams) => void;
  userOverlay?: (props: SFXParams) => void;
  enemyOverlay?: (props: SFXParams) => void;
  //emptySpaceOverlay?: (props: SFXParams) => void;
  battleOverlay?: (props: SFXParams) => void;
}

export default BattleSFXTemplate;
