import { BattleVfxTemplate } from "core/src/templateinterfaces/BattleVfxTemplate";

import
{
  assimilate as assimilateDrawingFunction,
  EffectIds as AssimilateEffectIds,
  EffectResults as AssimilateEffectResults,
} from "./drawingfunctions/assimilate";
import
{
  mergeRelease as mergeReleaseDrawingFunction,
  mergeAbsorb as mergeAbsorbDrawingFunction
} from "./drawingfunctions/merge";


export const assimilate: BattleVfxTemplate<AssimilateEffectIds, AssimilateEffectResults> =
{
  duration: 2500,
  vfxWillTriggerEffect: true,
  battleOverlay: assimilateDrawingFunction,
};
export const mergeRelease: BattleVfxTemplate =
{
  duration: 1500,
  vfxWillTriggerEffect: true,
  battleOverlay: mergeReleaseDrawingFunction,
};
export const mergeAbsorb: BattleVfxTemplate =
{
  duration: 1500,
  vfxWillTriggerEffect: true,
  battleOverlay: mergeAbsorbDrawingFunction,
};
