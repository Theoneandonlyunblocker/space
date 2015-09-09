/// <reference path="../../src/battlesfx/battlesfxutils.ts" />
/// <reference path="../../src/battlesfx/rocketattack.ts" />

module Rance
{
  export module Templates
  {
    export interface SFXParams
    {
      user: Unit;
      width: number;
      height: number;
      duration: number; // in milliseconds
      facingRight: boolean;
      onLoaded: (canvas: HTMLCanvasElement) => void;
    }
    export interface IBattleEffectSFX
    {
      duration: number;
      userSprite?: (props: SFXParams) => HTMLCanvasElement;
      userOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //emptySpaceOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //enemyOverlay?: (props: SFXParams) => HTMLCanvasElement;
      battleOverlay?: (props: SFXParams) => HTMLCanvasElement;
    }
  }
}
