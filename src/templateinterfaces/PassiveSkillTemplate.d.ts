import AbilityBase from "./AbilityBase";
import UnitEffectTemplate from "./UnitEffectTemplate";

declare interface PassiveSkillTemplate extends AbilityBase, UnitEffectTemplate
{
  displayName: string;
  description: string;
}

export default PassiveSkillTemplate;
