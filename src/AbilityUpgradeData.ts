import AbilityBase from "./templateinterfaces/AbilityBase";


export declare interface AbilityUpgradeData
{
  [source: string]:
  {
    // TODO 2017.08.06 | use separate object for learnable abilities
    // null if newly learnable ability
    base: AbilityBase | null;
    possibleUpgrades: AbilityBase[];
  };
}
