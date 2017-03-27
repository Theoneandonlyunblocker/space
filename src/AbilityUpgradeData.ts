import AbilityBase from "./templateinterfaces/AbilityBase";

export declare interface AbilityUpgradeData
{
  [source: string]:
  {
    base: AbilityBase;
    possibleUpgrades: AbilityBase[];
  };
}
