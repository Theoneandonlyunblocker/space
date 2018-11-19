import AbilityBase from "./templateinterfaces/AbilityBase";

export interface AbilityUpgradeSaveData
{
  source: string;
  possibleUpgrades: string[];
}

export interface UpgradableAbilitiesData
{
  [sourceAbilityType: string]:
  {
    source: AbilityBase;
    possibleUpgrades: AbilityBase[];
  };
}
