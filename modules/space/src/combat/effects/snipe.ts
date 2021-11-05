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
    "combatEffect_snipeAttack_displayName" |
    "combatEffect_snipeDefence_displayName" |
    "combatEffect_snipeIntelligence_displayName" |
    "combatEffect_snipeSpeed_displayName";
  let descriptionKey:
    "combatEffect_snipeAttack_description" |
    "combatEffect_snipeDefence_description" |
    "combatEffect_snipeIntelligence_description" |
    "combatEffect_snipeSpeed_description";

  switch (attribute)
  {
    case UnitAttribute.Attack:
    {
      key = "snipeAttack";
      displayNameKey = "combatEffect_snipeAttack_displayName";
      descriptionKey = "combatEffect_snipeAttack_description";

      break;
    }
    case UnitAttribute.Defence:
    {
      key = "snipeDefence";
      displayNameKey = "combatEffect_snipeDefence_displayName";
      descriptionKey = "combatEffect_snipeDefence_description";

      break;
    }
    case UnitAttribute.Intelligence:
    {
      key = "snipeIntelligence";
      displayNameKey = "combatEffect_snipeIntelligence_displayName";
      descriptionKey = "combatEffect_snipeIntelligence_description";

      break;
    }
    case UnitAttribute.Speed:
    {
      key = "snipeSpeed";
      displayNameKey = "combatEffect_snipeSpeed_displayName";
      descriptionKey = "combatEffect_snipeSpeed_description";

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
