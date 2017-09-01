import AbilityBase from "./templateinterfaces/AbilityBase";


export interface UpgradableAbilitiesData
{
  [sourceAbilityType: string]:
  {
    // TODO 2017.08.23 | rename 'source'
    base: AbilityBase;
    possibleUpgrades: AbilityBase[];
  };
}
