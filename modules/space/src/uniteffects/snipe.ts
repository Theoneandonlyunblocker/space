import {UnitEffectTemplate} from "core/src/templateinterfaces/UnitEffectTemplate";

import {UnitAttribute, getUnitAttributesObjectKeyForAttribute} from "core/src/unit/UnitAttributes";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { localizeMessage } from "modules/space/localization/localize";


function makeSnipeStatusEffect(attribute: UnitAttribute): UnitEffectTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const attributeAdjustment: Partial<FlatAndMultiplierAdjustment> =
  {
    multiplicativeMultiplier: 0.5,
  };

  return(
  {
    type: `snipe${capitalizedAttributeName}`,
    get displayName()
    {
      return localizeMessage("snipe_displayName").format(attribute);
    },
    attributes:
    {
      [getUnitAttributesObjectKeyForAttribute(attribute)]: attributeAdjustment,
    },
  });
}

export const snipeAttack = makeSnipeStatusEffect(UnitAttribute.Attack);
export const snipeDefence = makeSnipeStatusEffect(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeStatusEffect(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeStatusEffect(UnitAttribute.Speed);
