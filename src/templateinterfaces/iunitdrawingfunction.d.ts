/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="sfxparams.d.ts" />

declare namespace Rance
{
  namespace Templates
  {
    interface IUnitDrawingFunction
    {
      (unit: Unit, props: SFXParams): PIXI.DisplayObject;
    }
  }
}
