import { CombatActionResultModifier } from "core/src/combat/CombatActionResultModifier";
import { guardCoverageChange } from "../resultTemplates/guardCoverageChange";
import { GuardCoverage } from "core/src/unit/GuardCoverage";
import { resultModifierFlags } from "../resultModifierFlags";


// use when coverage change is natural part of ability. f.ex:
// ability: Ally Guard (guard units in same row) = setGuardCoverage<GuardCoverage.row>
// passive: Extended Shields (guard effects always apply to all units) = forceGuardCoverage<GuardCoverage.all>
export const setGuardCoverage: CombatActionResultModifier<GuardCoverage> =
{
  key: "setGuardCoverage",
  flags: new Set([resultModifierFlags.unforcedGuardCoverageChange]),
  modifyResult: (result, coverage) =>
  {
    result.set(guardCoverageChange, coverage);
  },
};
