import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { GuardCoverage } from "core/src/unit/GuardCoverage";


export const guardCoverageChange: CombatActionResultTemplate<GuardCoverage | null> =
{
  key: "guardCoverageChange",
  defaultValue: null,
  applyResult: (coverage, source, target, combatManager) =>
  {
    target.battleStats.guardCoverage = coverage;
    target.uiDisplayIsDirty = true;
  },
};
