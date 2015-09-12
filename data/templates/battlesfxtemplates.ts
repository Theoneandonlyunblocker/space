/// <reference path="../../src/battlesfx/battlesfxutils.ts" />
/// <reference path="../../src/battlesfx/rocketattack.ts" />
/// <reference path="../../src/battlesfx/guard.ts" />

module Rance
{
  export module Templates
  {
    export interface SFXParams
    {
      user: Unit;
      target: Unit;
      width: number;
      height: number;
      duration: number; // in milliseconds
      facingRight: boolean;
      onLoaded: (canvas: HTMLCanvasElement) => void;
    }
    export interface IBattleSFXTemplate
    {
      duration: number;
      delay?: number; // 0.0 - 1.0; how far in the sfx the effect function should be called
      userSprite?: (props: SFXParams) => HTMLCanvasElement;
      userOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //emptySpaceOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //enemyOverlay?: (props: SFXParams) => HTMLCanvasElement;
      battleOverlay?: (props: SFXParams) => HTMLCanvasElement;
    }
    export module BattleSFXTemplates
    {
      export var rocketAttack: IBattleSFXTemplate =
      {
        duration: 1500,
        battleOverlay: BattleSFX.rocketAttack,
        delay: 0.3
      }
      export var guard: IBattleSFXTemplate =
      {
        duration: 1500,
        battleOverlay: BattleSFX.guard,
        delay: 0.3
      }
    }
  }
}
