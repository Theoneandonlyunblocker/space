import { UnitAttribute, getKeyForAttribute } from "core/src/unit/UnitAttributes";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { localize } from "modules/space/localization/localize";


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
  switch (attribute)
  {
    case UnitAttribute.Attack:
    {
      key = "snipeAttack";
      displayNameKey = "snipeAttack_displayName";

      break;
    }
    case UnitAttribute.Defence:
    {
      key = "snipeDefence";
      displayNameKey = "snipeDefence_displayName";

      break;
    }
    case UnitAttribute.Intelligence:
    {
      key = "snipeIntelligence";
      displayNameKey = "snipeIntelligence_displayName";

      break;
    }
    case UnitAttribute.Speed:
    {
      key = "snipeSpeed";
      displayNameKey = "snipeSpeed_displayName";

      break;
    }
  }

  return(
  {
    key: key,
    getDisplayName: () => localize(displayNameKey),
    getDescription: () => "",
    getAttributeAdjustments: () =>
    {
      return {
        [getKeyForAttribute(attribute)]: attributeAdjustment,
      };
    },
  });
}
