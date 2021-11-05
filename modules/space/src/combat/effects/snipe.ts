import { UnitAttribute, getKeyForAttribute } from "core/src/unit/UnitAttributes";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { localize } from "modules/space/localization/localize";
import { localizeMessage } from "modules/space/localization/localize";


export const snipeAttack = makeSnipeEffect(UnitAttribute.Attack);
export const snipeDefence = makeSnipeEffect(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeEffect(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeEffect(UnitAttribute.Speed);

function makeSnipeEffect(attribute: UnitAttribute): CombatEffectTemplate
{
  const attributeAdjustment: Partial<FlatAndMultiplierAdjustment> =
  {
    multiplicativeMultiplier: 0.5,
  };

  let key: "snipeAttack" | "snipeDefence" | "snipeIntelligence" | "snipeSpeed";
  let displayNameKey: "snipeAttack_displayName" | "snipeDefence_displayName" | "snipeIntelligence_displayName" | "snipeSpeed_displayName";
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
      displayNameKey = "snipeAttack_displayName";
      descriptionKey = "combatEffect_snipeAttack_description";

      break;
    }
    case UnitAttribute.Defence:
    {
      key = "snipeDefence";
      displayNameKey = "snipeDefence_displayName";
      descriptionKey = "combatEffect_snipeDefence_description";

      break;
    }
    case UnitAttribute.Intelligence:
    {
      key = "snipeIntelligence";
      displayNameKey = "snipeIntelligence_displayName";
      descriptionKey = "combatEffect_snipeIntelligence_description";

      break;
    }
    case UnitAttribute.Speed:
    {
      key = "snipeSpeed";
      displayNameKey = "snipeSpeed_displayName";
      descriptionKey = "combatEffect_snipeSpeed_description";

      break;
    }
  }

  return(
  {
    key: key,
    getDisplayName: () => localize(displayNameKey),
    getDescription: (strength) => localizeMessage(descriptionKey).format(strength),
    isActive: (strength) => strength > 0,
    getAttributeAdjustments: () =>
    {
      return {
        [getKeyForAttribute(attribute)]: attributeAdjustment,
      };
    },
  });
}
