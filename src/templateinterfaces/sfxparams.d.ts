declare module Rance
{
  module Templates
  {
    interface SFXParams
    {
      user: Unit;
      target: Unit;
      width: number;
      height: number;
      duration: number; // in milliseconds
      facingRight: boolean;
      onLoaded: (canvas: HTMLCanvasElement) => void;
    }
  }
}
