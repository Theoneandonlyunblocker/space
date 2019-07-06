import * as PIXI from "pixi.js";

import {Unit} from "../Unit";

import {SfxParams} from "./SfxParams";

// needs to set unit.drawingFunctionData and call params.triggerStart()
export declare type UnitDrawingFunction = (unit: Unit, params: SfxParams) => void;
