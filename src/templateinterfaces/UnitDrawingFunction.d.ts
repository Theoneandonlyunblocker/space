/// <reference path="../../lib/pixi.d.ts" />

import Unit from "../Unit";

import SFXParams from "./SFXParams";

// needs to set unit.drawingFunctionData and call params.triggerStart()
declare type UnitDrawingFunction = (unit: Unit, params: SFXParams) => void;

export default UnitDrawingFunction;
