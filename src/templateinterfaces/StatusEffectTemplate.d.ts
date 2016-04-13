import AbilityEffectTemplate from "./AbilityEffectTemplate";
import StatusEffectAttributes from "./StatusEffectAttributes";

declare interface StatusEffectTemplate
{
  type: string;
  displayName: string;
  
  attributes?: StatusEffectAttributes;
  beforeAbilityUse?: AbilityEffectTemplate[];
  afterAbilityUse?: AbilityEffectTemplate[];
}

export default StatusEffectTemplate;
