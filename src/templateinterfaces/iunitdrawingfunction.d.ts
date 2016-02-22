/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="sfxparams.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IUnitDrawingFunction
    {
      (unit: Unit, props: SFXParams): PIXI.DisplayObject;
    }
  }
}
