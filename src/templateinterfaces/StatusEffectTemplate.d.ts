import StatusEffectAttributes from "./StatusEffectAttributes.d.ts";
import PassiveSkillTemplate from "./PassiveSkillTemplate.d.ts";

declare interface StatusEffectTemplate
{
  type: string;
  displayName: string;
  
  attributes?: StatusEffectAttributes;
  passiveSkills?: PassiveSkillTemplate[];
}

export default StatusEffectTemplate;
