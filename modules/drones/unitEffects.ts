import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";
import {UnitEffectTemplate} from "core/templateinterfaces/UnitEffectTemplate";

import
{
  adjustHealth,
} from "../space/effectactions/effectActions";

import {makePlaceholderVfx} from "../common/makePlaceholderVfx";
import { localize } from "./localization/localize";


export const infest: UnitEffectTemplate =
{
  type: "infest",
  get displayName()
  {
    return localize("infest_effect_displayName").toString();
  },
  get description()
  {
    return localize("infest_effect_description").toString();
  },
  afterAbilityUse:
  [
    {
      id: "damage",
      getUnitsInArea: user => [user],
      executeAction: (user, target, battle, executedEffectsResult, sourceStatusEffect) =>
      {
        const healthReductionForLastTick = 0.5;

        const tick = sourceStatusEffect.turnsHasBeenActiveFor + 1;
        const relativeTick = tick / sourceStatusEffect.turnsToStayActiveFor;
        const healthToReduceThisTurn = healthReductionForLastTick / relativeTick;

        adjustHealth({maxHealthPercentage: -healthToReduceThisTurn},
          user, target, battle, executedEffectsResult);
      },
      vfx: makePlaceholderVfx("infest"),
    },
  ],
};

export const merge: UnitEffectTemplate =
{
  type: "merge",
  get displayName()
  {
    return localize("merge_effect_displayName").toString();
  },
  attributes:
  {
    attack: {flat: 1},
    defence: {flat: 1},
    intelligence: {flat: 1},
    speed: {flat: 1},
  },
};

export const unitEffectTemplates: TemplateCollection<UnitEffectTemplate> =
{
  [infest.type]: infest,
  [merge.type]: merge,
};
