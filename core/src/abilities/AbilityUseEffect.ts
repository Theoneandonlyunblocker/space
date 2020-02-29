import {BattleVfxTemplate} from "../templateinterfaces/BattleVfxTemplate";
import {Unit} from "../unit/Unit";
import {UnitDisplayData} from "../unit/UnitDisplayData";


export interface AbilityUseEffect
{
  effectId: string;
  changedUnitDisplayData: {[unitId: number]: UnitDisplayData};
  vfx: BattleVfxTemplate;
  vfxUser: Unit;
  vfxTarget: Unit;
  newEvaluation: number;
}
