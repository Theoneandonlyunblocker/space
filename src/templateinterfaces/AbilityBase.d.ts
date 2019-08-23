import {AbilityEffectTemplate} from "./AbilityEffectTemplate";
import { ProbabilityDistributions } from "./ProbabilityDistribution";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


/**
 * base interface for abilities and passive skills
 */
export interface AbilityBase<EffectId extends string = any, R extends ExecutedEffectsResult = any>
{
  // should be unique, even between abilities & passive skills
  type: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  // used to check if it's a passive ability or not
  mainEffect?: AbilityEffectTemplate<EffectId, R>;

  // can be overridden in unit template
  defaultUpgrades?: ProbabilityDistributions<AbilityBase>;
}
