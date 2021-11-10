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
      key: "addWarpJammerModifier",
      battlePrepEffects:
      [
        {
          adjustment: {flat: 1},
          effect:
          {
            whenPartOfFormation:
            {
              onAdd: (strength, unit, battlePrep, ownFormation, enemyFormation) =>
              {
                const isAttackingSide = unit.fleet.player === battlePrep.attacker;

                if (isAttackingSide)
                {
                  const modifier = makeWarpJammerValidityModifier(unit, strength);
                  battlePrep.defenderFormation.addValidityModifier(modifier);
                }
              },
              onRemove: (strength, unit, battlePrep, ownFormation, enemyFormation) =>
              {
                const isAttackingSide = unit.fleet.player === battlePrep.attacker;

                if (isAttackingSide)
                {
                  const modifier = makeWarpJammerValidityModifier(unit, strength);
                  battlePrep.defenderFormation.removeValidityModifier(modifier);
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

function makeWarpJammerValidityModifier(unit: Unit, strength: number): FormationValidityModifier
{
  return {
    sourceType: FormationValidityModifierSourceType.PassiveAbility,
    effect:
    {
      minUnits: strength,
    },
    sourcePassiveAbility:
    {
      unit: unit,
      abilityTemplate: warpJammer,
    },
  };
}
