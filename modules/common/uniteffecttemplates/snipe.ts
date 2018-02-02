import UnitEffectTemplate from "../../../src/templateinterfaces/UnitEffectTemplate";

import {UnitAttribute} from "../../../src/UnitAttributes";


function makeSnipeStatusEffect(attribute: UnitAttribute): UnitEffectTemplate
{
  const attributeName = UnitAttribute[attribute];
  const capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);

  const key = `snipe${capitalizedAttributeName}`;
  const displayName = `Snipe: ${capitalizedAttributeName}`;

  return(
  {
    type: key,
    displayName: displayName,
    attributes:
    {
      [attributeName]:
      {
        multiplier: -0.5,
      },
    },
  });
}

export const snipeAttack = makeSnipeStatusEffect(UnitAttribute.Attack);
export const snipeDefence = makeSnipeStatusEffect(UnitAttribute.Defence);
export const snipeIntelligence = makeSnipeStatusEffect(UnitAttribute.Intelligence);
export const snipeSpeed = makeSnipeStatusEffect(UnitAttribute.Speed);
