/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="sfxparams.d.ts" />

namespace Templates
{
  interface IUnitDrawingFunction
  {
    (unit: Unit, props: SFXParams): PIXI.DisplayObject;
  }
}
