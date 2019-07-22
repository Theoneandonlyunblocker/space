import * as PIXI from "pixi.js";

import {Unit} from "../Unit";

import {VfxParams} from "./VfxParams";

// needs to set unit.drawingFunctionData and call params.triggerStart()
export declare type UnitDrawingFunction = (unit: Unit, params: VfxParams) => void;
