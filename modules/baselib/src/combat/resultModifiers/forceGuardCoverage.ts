import { CombatActionResultModifier } from "core/src/combat/CombatActionResultModifier";
import { guardCoverageChange } from "../resultTemplates/guardCoverageChange";
import { GuardCoverage } from "core/src/unit/GuardCoverage";
import { resultModifierFlags } from "../resultModifierFlags";


// use when coverage change comes from effects outside of the ability. f.ex:
// ability: Ally Guard (guard units in same row) = setGuardCoverage<GuardCoverage.row>
// passive: Extended Shields (guard effects always apply to all units) = forceGuardCoverage<GuardCoverage.all>
export const forceGuardCoverage: CombatActionResultModifier<GuardCoverage> =
{
  key: "forceGuardCoverage",
  flags: new Set([resultModifierFlags.forcedGuardCoverageChange]),
  flagsThatShouldBeExecutedBefore: [resultModifierFlags.unforcedGuardCoverageChange],
  modifyResult: (result, coverage) =>
  {
    result.set(guardCoverageChange, coverage);
  },
};
