/// <reference path="../../lib/pixi.d.ts" />

import SFXParams from "./SFXParams";
import Unit from "../Unit";

// needs to set unit.drawingFunctionData and call params.triggerStart()
declare interface UnitDrawingFunction
{
  (unit: Unit, params: SFXParams): void;
}

export default UnitDrawingFunction;
