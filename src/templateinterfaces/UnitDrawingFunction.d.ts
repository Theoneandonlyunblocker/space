/// <reference path="../../lib/pixi.d.ts" />

import SFXParams from "./SFXParams";
import Unit from "../Unit";

declare interface UnitDrawingFunction
{
  (unit: Unit, props: SFXParams): PIXI.DisplayObject;
}

export default UnitDrawingFunction;
