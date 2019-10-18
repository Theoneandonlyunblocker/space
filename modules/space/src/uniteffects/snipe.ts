import {UnitEffectTemplate} from "core/src/templateinterfaces/UnitEffectTemplate";

import {UnitAttribute, getKeyForAttribute} from "core/src/unit/UnitAttributes";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { localize } from "modules/space/localization/localize";


function makeSnipeStatusEffect(attribute: UnitAttribute): UnitEffectTemplate
{
  const attributeAdjustment: Partial<FlatAndMultiplierAdjustment> =
  {
    multiplicativeMultiplier: 0.5,
  };

  let abilityKey: "snipeAttack" | "snipeDefence" | "snipeIntelligence" | "snipeSpeed";
  let displayNameKey: "snipeAttack_displayName" | "snipeDefence_displayName" | "snipeIntelligence_displayName" | "snipeSpeed_displayName";
  switch (attribute)
  {
    case UnitAttribute.Attack:
    {
      abilityKey = "snipeAttack";
      displayNameKey = "snipeAttack_displayName";

      break;
    }
    case UnitAttribute.Defence:
    {
      abilityKey = "snipeDefence";
      displayNameKey = "snipeDefence_displayName";

      break;
    }
    case UnitAttribute.Intelligence:
    {
      abilityKey = "snipeIntelligence";
      displayNameKey = "snipeIntelligence_displayName";

      break;
    }
    case UnitAttribute.Speed:
    {
      abilityKey = "snipeSpeed";
      displayNameKey = "snipeSpeed_displayName";

      break;
    }
  }

  return(
  {
    type: abilityKey,
    get displayName()
    {
      return localize(displayNameKey);
    },
    attributes:
    {
      [getKeyForAttribute(attribute)]: attributeAdjustment,
    },
  });
}

export const snipeAttack = makeSnipeStatusEffect(UnitAttribute.Attack);
export const snipeDefence = makeSnipeStatusEffect(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeStatusEffect(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeStatusEffect(UnitAttribute.Speed);
