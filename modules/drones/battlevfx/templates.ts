import { BattleVfxTemplate } from "../../../src/templateinterfaces/BattleVfxTemplate";

import {assimilate as assimilateDrawingFunction} from "./drawingfunctions/assimilate";


export const assimilate: BattleVfxTemplate =
{
  duration: 2500,
  vfxWillTriggerEffect: true,
  battleOverlay: assimilateDrawingFunction,
}
