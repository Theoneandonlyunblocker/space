declare module Rance
{
  module Templates
  {
    interface IBattleSFXTemplate
    {
      duration: number;
      delay?: number; // 0.0 - 1.0; how far in the sfx the effect function should be called
      userSprite?: (props: SFXParams) => HTMLCanvasElement;
      userOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //emptySpaceOverlay?: (props: SFXParams) => HTMLCanvasElement;
      //enemyOverlay?: (props: SFXParams) => HTMLCanvasElement;
      battleOverlay?: (props: SFXParams) => HTMLCanvasElement;
    }
  }
}
