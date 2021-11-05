import {PassiveSkillTemplate} from "core/src/templateinterfaces/PassiveSkillTemplate";
import { localize } from "modules/space/localization/localize";

import { FormationValidityModifierSourceType, FormationValidityModifier } from "core/src/battleprep/BattlePrepFormationValidity";
import { Unit } from "core/src/unit/Unit";
import { medic } from "./medic";


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
      battlePrepEffects:
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
