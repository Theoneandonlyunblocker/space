/// <reference path="../../lib/pixi.d.ts" />

/// <reference path="sfxparams.d.ts" />

namespace Templates
{
  declare interface IBattleSFXTemplate
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
}
