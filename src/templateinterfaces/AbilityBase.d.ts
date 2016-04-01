import AbilityEffectTemplate from "./AbilityEffectTemplate.d.ts";

// base interface for abilities and passive skills
declare interface AbilityBase
{
  type: string;
  displayName: string;
  description: string;
  isHidden?: boolean;
  // used to check if it's a passive ability or not
  mainEffect?: AbilityEffectTemplate;

  // list of ability types this ability can be upgraded into
  // string[] because ability templates referencing ability templates can be a bit messy
  canUpgradeInto?: string[];
  // if true, can only be upgraded when unit has this ability in it's specialAbilityUpgrades
  onlyAllowExplicitUpgrade?: boolean;
}

export default AbilityBase;
