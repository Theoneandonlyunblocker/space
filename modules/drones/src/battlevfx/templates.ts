import { BattleVfxTemplate } from "core/src/templateinterfaces/BattleVfxTemplate";

import
{
  assimilate as assimilateDrawingFunction,
} from "./drawingfunctions/assimilate";
import
{
  mergeRelease as mergeReleaseDrawingFunction,
  mergeAbsorb as mergeAbsorbDrawingFunction
} from "./drawingfunctions/merge";


export const assimilate: BattleVfxTemplate =
{
  key: "assimilate",
  duration: 2500,
  vfxWillTriggerEffect: true,
  battleOverlay: assimilateDrawingFunction,
};
export const mergeRelease: BattleVfxTemplate =
{
  key: "mergeRelease",
  duration: 1500,
  vfxWillTriggerEffect: true,
  battleOverlay: mergeReleaseDrawingFunction,
};
export const mergeAbsorb: BattleVfxTemplate =
{
  key: "mergeAbsorb",
  duration: 1500,
  vfxWillTriggerEffect: true,
  battleOverlay: mergeAbsorbDrawingFunction,
};
