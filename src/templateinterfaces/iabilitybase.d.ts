declare module Rance
{
  module Templates
  {
    interface IAbilityBase
    {
      type: string;
      displayName: string;
      description: string;
      isHidden?: boolean;

      // list of ability types this ability can be upgraded into
      // string[] because ability templates referencing ability templates can be a bit messy
      canUpgradeInto?: string[];
      // if true, can only be upgraded when unit has this ability in it's specialAbilityUpgrades
      onlyAllowExplicitUpgrade?: boolean;
    }
  }
}
