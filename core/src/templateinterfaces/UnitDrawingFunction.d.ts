import * as PIXI from "pixi.js";

import {Unit} from "../unit/Unit";

import {VfxParams} from "./VfxParams";
import { UnitDrawingFunctionData } from "../unit/UnitDrawingFunctionData";


// needs to call params.triggerStart()
export declare type UnitDrawingFunction = (unit: Unit, params: VfxParams) => UnitDrawingFunctionData;
