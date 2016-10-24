import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";

import {UnitAttribute} from "../../../src/UnitAttributes";

function makeSnipeStatusEffect(attribute: UnitAttribute): StatusEffectTemplate
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

export const snipeAttack = makeSnipeStatusEffect(UnitAttribute.attack);
export const snipeDefence = makeSnipeStatusEffect(UnitAttribute.defence);
export const snipeIntelligence = makeSnipeStatusEffect(UnitAttribute.intelligence);
export const snipeSpeed = makeSnipeStatusEffect(UnitAttribute.speed);
