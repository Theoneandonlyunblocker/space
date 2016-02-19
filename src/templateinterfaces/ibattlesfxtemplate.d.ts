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
      userSprite?: (props: SFXParams) => PIXI.DisplayObject;
      userOverlay?: (props: SFXParams) => PIXI.DisplayObject;
      //emptySpaceOverlay?: (props: SFXParams) => PIXI.DisplayObject;
      //enemyOverlay?: (props: SFXParams) => PIXI.DisplayObject;
      battleOverlay?: (props: SFXParams) => PIXI.DisplayObject;
    }
  }
}
