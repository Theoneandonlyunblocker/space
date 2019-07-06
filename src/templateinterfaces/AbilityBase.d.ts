import {AbilityEffectTemplate} from "./AbilityEffectTemplate";
import { ProbabilityDistributions } from "./ProbabilityDistribution";

/**
 * base interface for abilities and passive skills
 */
export interface AbilityBase
{
  // should be unique, even between abilities & passive skills
  type: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  // used to check if it's a passive ability or not
  mainEffect?: AbilityEffectTemplate;

  // can be overridden in unit template
  defaultUpgrades?: ProbabilityDistributions<AbilityBase>;
}
