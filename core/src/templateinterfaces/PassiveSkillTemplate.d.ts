import {AbilityBase} from "./AbilityBase";
import {UnitEffectTemplate} from "./UnitEffectTemplate";

export interface PassiveSkillTemplate extends AbilityBase, UnitEffectTemplate
{
  displayName: string;
  description: string;
}
