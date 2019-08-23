import {VfxParams} from "./templateinterfaces/VfxParams";
import {ExecutedEffectsResult} from "./templateinterfaces/ExecutedEffectsResult";


export type VfxDrawingFunction<EffectId extends string = any, R extends ExecutedEffectsResult = any>
  = (props: VfxParams<EffectId, R>) => void;
