import {PassiveSkillTemplate} from "src/templateinterfaces/PassiveSkillTemplate";

import {BattlePrep} from "src/battleprep/BattlePrep";
import {GuardCoverage} from "src/unit/GuardCoverage";
import {Unit} from "src/unit/Unit";

import {autoHeal as autoHealStatusEffect} from "../uniteffects/autoHeal";
import {poisoned as poisonedStatusEffect} from "../uniteffects/poisoned";

import { FormationValidityModifierSourceType } from "src/battleprep/BattlePrepFormationValidity";
import * as EffectActions from "../effectactions/effectActions";
import { localize } from "./localization/localize";


export const autoHeal: PassiveSkillTemplate =
{
  type: "autoHeal",
  get displayName()
  {
    return localize("autoHeal_displayName").toString();
  },
  get description()
  {
    return localize("autoHeal_description").toString();
  },

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: EffectActions.addStatusEffect.bind(null,
      {
        duration: Infinity,
        template: autoHealStatusEffect,
      }),
    },
  ],
};
export const overdrive: PassiveSkillTemplate =
{
  type: "overdrive",
  get displayName()
  {
    return localize("overdrive_displayName").toString();
  },
  get description()
  {
    return localize("overdrive_description").toString();
  },

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: EffectActions.addStatusEffect.bind(null,
      {
        duration: 2,
        template: poisonedStatusEffect,
      }),
    },
  ],
};

const initialGuardStrength = 50;
export const initialGuard: PassiveSkillTemplate =
{
  type: "initialGuard",
  get displayName()
  {
    return localize("initialGuard_displayName").toString();
  },
  get description()
  {
    return localize("initialGuard_description").toString();
  },
  isHidden: true,

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: EffectActions.addGuard.bind(null,
      {
        coverage: GuardCoverage.Row,
        flat: initialGuardStrength,
      }),
    },
  ],
  inBattlePrep:
  [
    {
      onAdd: (user: Unit, battlePrep: BattlePrep) =>
      {
        EffectActions.addGuard(
        {
          coverage: GuardCoverage.Row,
          flat: initialGuardStrength,
        },
        user, user, null, {});
      },
      onRemove: (user: Unit, battlePrep: BattlePrep) =>
      {
        user.removeGuard(initialGuardStrength);
      },
    },
  ],
};
export const medic: PassiveSkillTemplate =
{
  type: "medic",
  get displayName()
  {
    return localize("medic_displayName").toString();
  },
  get description()
  {
    return localize("medic_description").toString();
  },

  atTurnStart:
  [
    (user) =>
    {
      const star = user.fleet.location;
      const allFriendlyUnits = star.getUnits(player => player === user.fleet.player);
      for (let i = 0; i < allFriendlyUnits.length; i++)
      {
        allFriendlyUnits[i].addHealth(allFriendlyUnits[i].maxHealth);
      }
    },
  ],
};
function makeWarpJammerValidityModifier(user: Unit)
{
  return {
    sourceType: FormationValidityModifierSourceType.PassiveAbility,
    effect:
    {
      minUnits: 1,
    },
    sourcePassiveAbility:
    {
      unit: user,
      abilityTemplate: warpJammer,
    },
  };
}

export const warpJammer: PassiveSkillTemplate =
{
  type: "warpJammer",
  get displayName()
  {
    return localize("warpJammer_displayName").toString();
  },
  get description()
  {
    return localize("warpJammer_description").toString();
  },

  inBattlePrep:
  [
    {
      onAdd: (user: Unit, battlePrep: BattlePrep) =>
      {
        const isAttackingSide = user.fleet.player === battlePrep.attacker;

        if (isAttackingSide)
        {
          battlePrep.defenderFormation.addValidityModifier(makeWarpJammerValidityModifier(user));
        }
      },
      onRemove: (user: Unit, battlePrep: BattlePrep) =>
      {
        const isAttackingSide = user.fleet.player === battlePrep.attacker;

        if (isAttackingSide)
        {
          battlePrep.defenderFormation.removeValidityModifier(makeWarpJammerValidityModifier(user));
        }
      },
    },
  ],

  defaultUpgrades:
  [
    {
      flatProbability: 1,
      probabilityItems: [medic],
    },
  ],
};
