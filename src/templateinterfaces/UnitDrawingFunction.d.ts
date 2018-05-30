/// <reference path="../../lib/pixi.d.ts" />

import Unit from "../Unit";

import SfxParams from "./SfxParams";

// needs to set unit.drawingFunctionData and call params.triggerStart()
declare type UnitDrawingFunction = (unit: Unit, params: SfxParams) => void;

export default UnitDrawingFunction;
