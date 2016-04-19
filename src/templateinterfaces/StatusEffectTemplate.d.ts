import AbilityEffectTemplate from "./AbilityEffectTemplate";
import StatusEffectAttributes from "./StatusEffectAttributes";
import UnitPassiveEffect from "./UnitPassiveEffect";

declare interface StatusEffectTemplate extends UnitPassiveEffect
{
  type: string;
  displayName: string;
  description?: string;
  isHidden?: boolean;
  
  attributes?: StatusEffectAttributes;
  beforeAbilityUse?: AbilityEffectTemplate[];
  afterAbilityUse?: AbilityEffectTemplate[];
}

export default StatusEffectTemplate;
