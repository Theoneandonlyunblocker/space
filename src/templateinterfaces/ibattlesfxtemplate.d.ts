/// <reference path="../../lib/pixi.d.ts" />

/// <reference path="sfxparams.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IBattleSFXTemplate
    {
      duration: number;
      delay?: number; // 0.0 - 1.0; how far in the sfx the effect function should be called
      userSprite?: (props: SFXParams) => void;
      userOverlay?: (props: SFXParams) => void;
      //emptySpaceOverlay?: (props: SFXParams) => void;
      //enemyOverlay?: (props: SFXParams) => void;
      battleOverlay?: (props: SFXParams) => void;
    }
  }
}
