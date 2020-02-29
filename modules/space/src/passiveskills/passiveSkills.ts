import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";

import { localize } from "modules/space/localization/localize";
import { GuardCoverage } from "core/src/unit/GuardCoverage";
import { FormationValidityModifierSourceType, FormationValidityModifier } from "core/src/battleprep/BattlePrepFormationValidity";
import { Unit } from "core/src/unit/Unit";
import { autoHeal as autoHealEffect } from "modules/space/src/combat/effects/autoHeal";


export const autoHeal: PassiveSkillTemplate =
{
  key: "autoHeal",
  get displayName()
  {
    return localize("autoHeal_displayName").toString();
  },
  get description()
  {
    return localize("autoHeal_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "autoHealInBattle",
      selfBattlePrepEffects:
      [
        {
          adjustment: {flat: 50},
          effect:
          {
            initialize: (strength, unit) =>
            {
              unit.battleStats.combatEffects.get(autoHealEffect).strength += strength;
            },
          },
        },
      ],
    },
  ],
};
export const initialGuard: PassiveSkillTemplate =
{
  key: "initialGuard",
  get displayName()
  {
    return localize("initialGuard_displayName").toString();
  },
  get description()
  {
    return localize("initialGuard_description").toString();
  },
  isHidden: true,
  mapLevelModifiers:
  [
    {
      key: "addInitialGuardInBattle",
      selfBattlePrepEffects:
      [
        {
          adjustment: {flat: 50},
          effect:
          {
            initialize: (strength, unit) =>
            {
              unit.battleStats.guardCoverage = GuardCoverage.Row;
              unit.battleStats.guardAmount = strength;
            },
          },
        },
      ],
    },
  ],
};
export const medic: PassiveSkillTemplate =
{
  key: "medic",
  get displayName()
  {
    return localize("medic_displayName").toString();
  },
  get description()
  {
    return localize("medic_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "medic",
      // TODO 2020.02.29 | implement

      // atTurnStart:
      // const star = user.fleet.location;
      // const allFriendlyUnits = star.getUnits(player => player === user.fleet.player);
      // for (let i = 0; i < allFriendlyUnits.length; i++)
      // {
      //   allFriendlyUnits[i].addHealth(allFriendlyUnits[i].maxHealth);
      // }
    },
  ],
};
function makeWarpJammerValidityModifier(unit: Unit): FormationValidityModifier
{
  return {
    sourceType: FormationValidityModifierSourceType.PassiveAbility,
    effect:
    {
      minUnits: 1,
    },
    sourcePassiveAbility:
    {
      unit: unit,
      abilityTemplate: warpJammer,
    },
  };
}

export const warpJammer: PassiveSkillTemplate =
{
  key: "warpJammer",
  get displayName()
  {
    return localize("warpJammer_displayName").toString();
  },
  get description()
  {
    return localize("warpJammer_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "addInitialGuardInBattle",
      selfBattlePrepEffects:
      [
        {
          adjustment: {flat: 50},
          effect:
          {
            whenPartOfFormation:
            {
              onAdd: (strength, unit, battlePrep, ownFormation, enemyFormation) =>
              {
                const isAttackingSide = unit.fleet.player === battlePrep.attacker;

                if (isAttackingSide)
                {
                  battlePrep.defenderFormation.addValidityModifier(makeWarpJammerValidityModifier(unit));
                }
              },
              onRemove: (strength, unit, battlePrep, ownFormation, enemyFormation) =>
              {
                const isAttackingSide = unit.fleet.player === battlePrep.attacker;

                if (isAttackingSide)
                {
                  battlePrep.defenderFormation.removeValidityModifier(makeWarpJammerValidityModifier(unit));
                }
              },
            },
          },
        },
      ],
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

export const miner: PassiveSkillTemplate =
{
  key: "miner",
  get displayName()
  {
    return localize("miner_displayName").toString();
  },
  get description()
  {
    return localize("miner_description").toString();
  },
  mapLevelModifiers:
  [
    {
      key: "miner",
      // TODO 2019.11.05 | never gets rechecked if the star is captured while the unit is in it. same problem with other modifiers relying on checks outside their own scope
      filter: unit =>
      {
        const locationHasResources = Boolean(unit.fleet.location.resource);
        const locationIsControlledByOwner = unit.fleet.player === unit.fleet.location.owner;

        return locationHasResources && locationIsControlledByOwner;
      },
      propagations:
      {
        localStar:
        [
          {
            key: "localMiner",
            self:
            {
              adjustments:
              {
                mining: {flat: 1},
              },
            },
          },
        ],
      },
    },
  ],
};
