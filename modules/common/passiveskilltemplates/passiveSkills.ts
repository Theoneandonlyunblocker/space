import PassiveSkillTemplate from "../../../src/templateinterfaces/PassiveSkillTemplate";

import BattlePrep from "../../../src/BattlePrep";
import GuardCoverage from "../../../src/GuardCoverage";
import Unit from "../../../src/Unit";

import autoHealStatusEffect from "../uniteffecttemplates/autoHeal";
import poisonedStatusEffect from "../uniteffecttemplates/poisoned";

import { FormationValidityModifierSourceType } from "../../../src/BattlePrepFormationValidity";
import * as EffectActions from "../effectactiontemplates/effectActions";


export const autoHeal: PassiveSkillTemplate =
{
  type: "autoHeal",
  displayName: "Auto heal",
  description: "Restore 50 health after every action",

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: EffectActions.addStatusEffect.bind(null,
      {
        duration: -1,
        template: autoHealStatusEffect,
      }),
    },
  ],
};
export const overdrive: PassiveSkillTemplate =
{
  type: "overdrive",
  displayName: "Overdrive",
  description: "Gives buffs at battle start but become poisoned",

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
  displayName: "Initial Guard",
  description: "Adds initial guard",
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
  displayName: "Medic",
  description: "Heals all units in same star to full at turn start",

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
  displayName: "Warp Jammer",
  description: "Forces an extra unit to defend when starting a battle",

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
