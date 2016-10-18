import StatusEffectTemplate from "../../src/templateinterfaces/StatusEffectTemplate";

import
{
  adjustHealth,
} from "../common/effectactiontemplates/effectActions";

import {placeholder as placeholderSFX} from "../common/battlesfxtemplates/battleSFX";

// TODO 18.10.2016 | pretty sure this is bugged with multiple status effects of the same type
export const infest: StatusEffectTemplate =
{
  type: "infest",
  displayName: "Infest",
  description: "Deal increasing damage at the end of every turn",
  afterAbilityUse:
  [
    {
      id: "damage",
      getUnitsInArea: (user) => [user],
      executeAction: (user, target, battle, executedEffectsResult) =>
      {
        const infestEffect = user.battleStats.statusEffects.filter((statusEffect) =>
        {
          return statusEffect.template.type === "infest";
        })[0];

        const damageDealtThisTurn = 0.5 / infestEffect.duration;

        adjustHealth({maxHealthPercentage: -damageDealtThisTurn},
          user, target, battle, executedEffectsResult);
      },
      sfx: placeholderSFX,
    },
  ],
};

