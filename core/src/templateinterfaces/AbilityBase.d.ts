import { ProbabilityDistributions } from "./ProbabilityDistribution";


/**
 * base interface for abilities and passive skills
 */
export interface AbilityBase
{
  // should be unique, even between abilities & passive skills
  key: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  // used to check if it's a passive ability or not
  // TODO 2020.02.25 | better way to do this?
  use?: any;

  // can be overridden in unit template
  defaultUpgrades?: ProbabilityDistributions<AbilityBase>;
}
