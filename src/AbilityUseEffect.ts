import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {ExecutedEffectsResult} from "./templateinterfaces/ExecutedEffectsResult";
import {Unit} from "./Unit";
import {UnitDisplayData} from "./UnitDisplayData";


export interface AbilityUseEffect<R extends ExecutedEffectsResult = {}>
{
  effectId: string;
  changedUnitDisplayData: {[unitId: number]: UnitDisplayData};
  executedEffectsResult: R;
  vfx: BattleVfxTemplate;
  vfxUser: Unit;
  vfxTarget: Unit;
  newEvaluation: number;
}
