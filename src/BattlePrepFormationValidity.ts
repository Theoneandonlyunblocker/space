import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import Unit from "./Unit";

export enum FormationValidityReason

// can't use binary operator as it clobbers the enum type
// https://github.com/Microsoft/TypeScript/issues/22709
{
  Valid          = 0,
  NotEnoughUnits = 1,
}

export enum FormationValidityModifierSourceType
{
  OffensiveBattle,
  AttackedInEnemyTerritory,
  AttackedInNeutralTerritory,
  PassiveAbility,
}

export interface FormationValidityModifierEffect
{
  minUnits?: number;
}

export interface FormationValidityModifier
{
  sourceType: FormationValidityModifierSourceType;
  effect: FormationValidityModifierEffect;
  sourcePassiveAbility?:
  {
    unit: Unit;
    abilityTemplate: PassiveSkillTemplate,
  };
}

export interface FormationValidity
{
  isValid: boolean;
  reasons: FormationValidityReason;
  modifiers: FormationValidityModifier[];
}

// tslint:disable:no-bitwise
export function extractFormationValidityReasons(reasons: FormationValidityReason): FormationValidityReason[]
{
  const allPresentReasons = Object.keys(FormationValidityReason).map(key =>
  {
    return FormationValidityReason[key];
  }).filter(reason =>
  {
    const reasonIsPresent = reasons & reason;

    return reasonIsPresent;
  }).sort((a, b) =>
  {
    return a - b;
  });

  return allPresentReasons;
}
// tslint:enable:no-bitwise

export function squashValidityModifierEffects(...effects: FormationValidityModifierEffect[]): FormationValidityModifierEffect
{
  const squashed: FormationValidityModifierEffect =
  {
    minUnits: 0,
  };

  effects.forEach(toSquash =>
  {
    for (const prop in toSquash)
    {
      switch (prop)
      {
        case "minUnits":
        {
          squashed[prop] += toSquash[prop];

          break;
        }
      }
    }
  });

  return squashed;
}

export function validityModifiersAreEqual(a: FormationValidityModifier, b: FormationValidityModifier): boolean
{
  const sameSourceType = a.sourceType === b.sourceType;
  if (!sameSourceType)
  {
    return false;
  }

  const effectsMatch = validityModifierEffectsAreEqual(a, b);
  if (!effectsMatch)
  {
    return false;
  }

  const sourcePassiveAbilitiesMatch = a.sourcePassiveAbility === b.sourcePassiveAbility;
  if (!sourcePassiveAbilitiesMatch)
  {
    return false;
  }

  return true;
}

function validityModifierEffectsAreEqual(a: FormationValidityModifier, b: FormationValidityModifier): boolean
{
  const effectCountsMatch = Object.keys(a.effect).length === Object.keys(b.effect).length;
  if (!effectCountsMatch)
  {
    return false;
  }
  else
  {
    const effectsMatch = Object.keys(a.effect).some(effectType =>
    {
      return a.effect[effectType] !== b.effect[effectType];
    });

    return effectsMatch;
  }
}
