import {UnitEffectTemplate} from "../../../src/templateinterfaces/UnitEffectTemplate";

import {UnitAttribute, getUnitAttributesObjectKeyForAttribute} from "../../../src/unit/UnitAttributes";
import { FlatAndMultiplierAdjustment } from "../../../src/generic/FlatAndMultiplierAdjustment";


function makeSnipeStatusEffect(attribute: UnitAttribute): UnitEffectTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const key = `snipe${capitalizedAttributeName}`;
  const displayName = `Snipe: ${capitalizedAttributeName}`;

  const attributeAdjustment: Partial<FlatAndMultiplierAdjustment> =
  {
    multiplicativeMultiplier: 0.5,
  };

  return(
  {
    type: key,
    displayName: displayName,
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
