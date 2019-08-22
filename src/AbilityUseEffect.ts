import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {ExecutedEffectsResult} from "./templateinterfaces/AbilityEffectAction";
import {Unit} from "./Unit";
import {UnitDisplayData} from "./UnitDisplayData";


export type AbilityUseEffectsById = {[id: string]: AbilityUseEffect};

export interface AbilityUseEffect
{
  effectId: string;
  changedUnitDisplayData: {[unitId: number]: UnitDisplayData};
  executedEffectsResult: ExecutedEffectsResult;
  vfx: BattleVfxTemplate;
  vfxUser: Unit;
  vfxTarget: Unit;
  newEvaluation: number;
}
