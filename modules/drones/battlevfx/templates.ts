import { BattleVfxTemplate } from "../../../src/templateinterfaces/BattleVfxTemplate";

import {assimilate as assimilateDrawingFunction} from "./drawingfunctions/assimilate";


export const assimilate: BattleVfxTemplate =
{
  duration: 1500,
  vfxWillTriggerEffect: true,
  battleOverlay: assimilateDrawingFunction,
}
