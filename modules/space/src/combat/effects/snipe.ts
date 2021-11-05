import { UnitAttribute, getKeyForAttribute } from "core/src/unit/UnitAttributes";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { localizeMessage } from "modules/space/localization/localize";


export const snipeAttack = makeSnipeEffect(UnitAttribute.Attack);
export const snipeDefence = makeSnipeEffect(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeEffect(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeEffect(UnitAttribute.Speed);


export const snipeAttributeAdjustment: Partial<FlatAndMultiplierAdjustment> =
{
  multiplicativeMultiplier: 0.5,
};

function makeSnipeEffect(attribute: UnitAttribute): CombatEffectTemplate
{

  let key: "snipeAttack" | "snipeDefence" | "snipeIntelligence" | "snipeSpeed";
  let displayNameKey:
    "effect_snipeAttack_displayName" |
    "effect_snipeDefence_displayName" |
    "effect_snipeIntelligence_displayName" |
    "effect_snipeSpeed_displayName";
  let descriptionKey:
    "effect_snipeAttack_description" |
    "effect_snipeDefence_description" |
    "effect_snipeIntelligence_description" |
    "effect_snipeSpeed_description";

  switch (attribute)
  {
    case UnitAttribute.Attack:
    {
      key = "snipeAttack";
      displayNameKey = "effect_snipeAttack_displayName";
      descriptionKey = "effect_snipeAttack_description";

      break;
    }
    case UnitAttribute.Defence:
    {
      key = "snipeDefence";
      displayNameKey = "effect_snipeDefence_displayName";
      descriptionKey = "effect_snipeDefence_description";

      break;
    }
    case UnitAttribute.Intelligence:
    {
      key = "snipeIntelligence";
      displayNameKey = "effect_snipeIntelligence_displayName";
      descriptionKey = "effect_snipeIntelligence_description";

      break;
    }
    case UnitAttribute.Speed:
    {
      key = "snipeSpeed";
      displayNameKey = "effect_snipeSpeed_displayName";
      descriptionKey = "effect_snipeSpeed_description";

      break;
    }
  }

  return(
  {
    key: key,
    get displayName()
    {
      return localizeMessage(displayNameKey).toString();
    },
    getDescription: (strength) => localizeMessage(descriptionKey).format(strength),
    isActive: (strength) => strength > 0,
    getAttributeAdjustments: () =>
    {
      return {
        [getKeyForAttribute(attribute)]: snipeAttributeAdjustment,
      };
    },
  });
}
