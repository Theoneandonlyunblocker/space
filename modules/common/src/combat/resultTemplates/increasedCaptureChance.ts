import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";


export const increasedCaptureChance: CombatActionResultTemplate<number> =
{
  key: "increasedCaptureChance",
  defaultValue: 0,
  applyResult: (value, source, target, combatManager) =>
  {
    target.battleStats.captureChance += value;
  },
};
