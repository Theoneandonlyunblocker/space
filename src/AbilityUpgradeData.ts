import AbilityBase from "./templateinterfaces/AbilityBase";

declare interface AbilityUpgradeData
{
  [source: string]:
  {
    base: AbilityBase;
    possibleUpgrades: AbilityBase[];
  }
}

export default AbilityUpgradeData;
