import {CombatEffectTemplate} from "core/src/combat/CombatEffectTemplate";
import { localize } from "modules/space/localization/localize";
import { CombatAction } from "core/src/combat/CombatAction";
import { addHealthRestoration } from "modules/common/src/combat/modifiers/addHealthRestoration";


export const autoHeal: CombatEffectTemplate =
{
  key: "autoHeal",
  getDisplayName: stength =>
  {
    return localize("autoHeal_displayName").toString();
  },
  getDescription: stength =>
  {
    return localize("autoHeal_description").toString();
  },
  actionsPerPhase:
  {
    afterMainPhase: (unit) =>
    {
      const autoHealStrength = unit.battleStats.combatEffects.get(autoHeal).strength;

      const action = new CombatAction(
      {
        mainAction: addHealthRestoration({flat: autoHealStrength}),
        source: unit,
        target: unit,
      });

      return [
        action,
      ];
    },
  },
};
