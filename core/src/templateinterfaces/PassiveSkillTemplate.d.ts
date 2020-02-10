import {AbilityBase} from "./AbilityBase";

export interface PassiveSkillTemplate extends AbilityBase, UnitEffectTemplate
{
  displayName: string;
  description: string;
}
