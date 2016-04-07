import AbilityEffectTemplate from "./AbilityEffectTemplate.d.ts";
import StatusEffectAttributes from "./StatusEffectAttributes.d.ts";

declare interface StatusEffectTemplate
{
  type: string;
  displayName: string;
  
  attributes?: StatusEffectAttributes;
  beforeAbilityUse?: AbilityEffectTemplate[];
  afterAbilityUse?: AbilityEffectTemplate[];
}

export default StatusEffectTemplate;
