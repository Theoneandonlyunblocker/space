import {TemplateCollection} from "../../src/templateinterfaces/TemplateCollection";
import {UnitEffectTemplate} from "../../src/templateinterfaces/UnitEffectTemplate";

import
{
  adjustHealth,
} from "../space/effectactions/effectActions";

import {makePlaceholderVfx} from "../common/makePlaceholderVfx";


export const infest: UnitEffectTemplate =
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
  displayName: "Merge",
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
