/// <reference path="../../lib/pixi.d.ts" />

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
      renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
      triggerStart: (container: PIXI.Container) => void;
      triggerEnd: () => void;
    }
  }
}
