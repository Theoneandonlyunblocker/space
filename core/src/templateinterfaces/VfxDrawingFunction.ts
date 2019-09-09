import {VfxParams} from "./VfxParams";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export type VfxDrawingFunction<EffectId extends string = any, R extends ExecutedEffectsResult = any>
  = (props: VfxParams<EffectId, R>) => void;
