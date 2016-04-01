/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="sfxparams.d.ts" />

declare interface IUnitDrawingFunction
{
  (unit: Unit, props: SFXParams): PIXI.DisplayObject;
}
