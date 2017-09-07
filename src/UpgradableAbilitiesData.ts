import AbilityBase from "./templateinterfaces/AbilityBase";


export interface UpgradableAbilitiesData
{
  [sourceAbilityType: string]:
  {
    source: AbilityBase;
    possibleUpgrades: AbilityBase[];
  };
}
