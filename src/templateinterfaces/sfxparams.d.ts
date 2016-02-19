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
      triggerStart: (container: PIXI.Container) => void;
      triggerEnd: () => void;
    }
  }
}
