import {VfxParams} from "./templateinterfaces/VfxParams";
import {ExecutedEffectsResult} from "./templateinterfaces/ExecutedEffectsResult";


export type VfxDrawingFunction<EffectId extends string = never, R extends ExecutedEffectsResult = {}>
  = (props: VfxParams<EffectId, R>) => void;
