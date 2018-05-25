import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import Unit from "./Unit";
import { shallowEqual } from "./utility";


// can't use binary operator as it clobbers the enum type
// https://github.com/Microsoft/TypeScript/issues/22709
export enum FormationInvalidityReason
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
  reasons: FormationInvalidityReason;
  modifiers: FormationValidityModifier[];
}

// tslint:disable:no-bitwise
export function extractFormationInvalidityReasons(reasons: FormationInvalidityReason): FormationInvalidityReason[]
{
  const allPresentReasons = Object.keys(FormationInvalidityReason).map(key =>
  {
    return FormationInvalidityReason[key];
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

export function squashValidityModifierEffects(
  ...effects: FormationValidityModifierEffect[],
): Required<FormationValidityModifierEffect>
{
  const squashed: Required<FormationValidityModifierEffect> =
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

  const effectsMatch = shallowEqual(a.effect, b.effect);
  if (!effectsMatch)
  {
    return false;
  }

  const sourcePassiveAbilitiesMatch = shallowEqual(a.sourcePassiveAbility, b.sourcePassiveAbility);
  if (!sourcePassiveAbilitiesMatch)
  {
    return false;
  }

  return true;
}
