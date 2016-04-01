/// <reference path="../../lib/pixi.d.ts" />

import SFXParams from "./SFXParams.d.ts";

declare interface UnitDrawingFunction
{
  (unit: Unit, props: SFXParams): PIXI.DisplayObject;
}

export default UnitDrawingFunction;
