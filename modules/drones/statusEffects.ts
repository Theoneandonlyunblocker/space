import StatusEffectTemplate from "../../src/templateinterfaces/StatusEffectTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import
{
  adjustHealth,
} from "../common/effectactiontemplates/effectActions";

import {placeholder as placeholderSFX} from "../common/battlesfxtemplates/battleSFX";

export const infest: StatusEffectTemplate =
{
  type: "infest",
  displayName: "Infest",
  description: "Deal increasing damage at the end of every turn",
  afterAbilityUse:
  [
    {
      id: "damage",
      getUnitsInArea: user => [user],
      executeAction: (user, target, battle, executedEffectsResult, sourceStatusEffect) =>
      {
        const tick = sourceStatusEffect.turnsHasBeenActiveFor + 1;
        const relativeTick = tick / sourceStatusEffect.turnsToStayActiveFor;
        const damageDealtThisTurn = 0.5 / relativeTick;

        adjustHealth({maxHealthPercentage: -damageDealtThisTurn},
          user, target, battle, executedEffectsResult);
      },
      sfx: placeholderSFX,
    },
  ],
};

export const merge: StatusEffectTemplate =
{
  type: "merge",
  displayName: "Merge",
  attributes:
  {
    attack: {flat: 1},
    defence: {flat: 1},
    intelligence: {flat: 1},
    speed: {flat: 1},
  },
};

export const statusEffectTemplates: TemplateCollection<StatusEffectTemplate> =
{
  [infest.type]: infest,
  [merge.type]: merge,
};
