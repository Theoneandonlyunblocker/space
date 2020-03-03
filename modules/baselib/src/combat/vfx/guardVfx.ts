import { BattleVfxTemplate } from "core/src/templateinterfaces/BattleVfxTemplate";
import { guardDrawingFunction } from "./guardDrawingFunction";


export const guardVfx: BattleVfxTemplate =
{
  duration: 750,
  battleOverlay: guardDrawingFunction,
  vfxWillTriggerEffect: true,
};
