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
    }
    export interface IBattleEffectSFX
    {
      duration: number;
      userSprite?: (props: SFXParams) => HTMLCanvasElement;
      userOverlay?: (props: SFXParams) => HTMLCanvasElement;
      emptySpaceOverlay?: (props: SFXParams) => HTMLCanvasElement;
      enemyOverlay?: (props: SFXParams) => HTMLCanvasElement;
      battleOverlay?: (props: SFXParams) => HTMLCanvasElement;
    }
  }
}
