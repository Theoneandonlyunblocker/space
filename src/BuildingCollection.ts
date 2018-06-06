import {BuildingEffect, getBaseBuildingEffect} from "./BuildingEffect";

import {Building} from "./Building";
import {squashAdjustmentsObjects} from "./FlatAndMultiplierAdjustment";
import BuildingUpgradeData from "./BuildingUpgradeData";
import BuildingSaveData from "./savedata/BuildingSaveData";


export class BuildingCollection<T extends Building = Building>
{
  private readonly buildings: T[] = [];
  private cachedEffects: BuildingEffect;
  private cachedEffectsAreDirty: boolean = true;

  private readonly onAddBuilding: (building: T) => void;

  constructor(onAddBuilding: (building: T) => void)
  {
    this.onAddBuilding = onAddBuilding;
  }

  public has(building: T): boolean
  {
    return this.buildings.indexOf(building) !== -1;
  }
  public add(building: T): void
  {
    if (this.has(building))
    {
      throw new Error("Already has building");
    }

    this.buildings.push(building);
    this.onAddBuilding(building);
  }
  public remove(building: T): void
  {
    const index = this.buildings.indexOf(building);

    if (index === -1)
    {
      throw new Error("");
    }

    this.buildings.splice(index, 1);
  }
  public getEffects(): BuildingEffect
  {
    if (this.cachedEffectsAreDirty)
    {
      this.cachedEffects = this.calculateBuildingEffects();
    }

    return this.cachedEffects;
  }
  public getBuildingUpgrades(
    filterFN: (building: T) => boolean,
  ): {[buildingId: number]: BuildingUpgradeData[]}
  {
    const allUpgrades:
    {
      [buildingId: number]: BuildingUpgradeData[];
    } = {};

    // TODO 2018.06.05 |
    const upgradableBuildings = this.buildings.filter(filterFN);


    return allUpgrades;
  }
  public serialize(): BuildingSaveData[]
  {
    return this.buildings.map(building => building.serialize());
  }

  private calculateBuildingEffects(): BuildingEffect
  {
    const baseEffect = getBaseBuildingEffect();
    const buildingEffects = this.buildings.map(building => building.getEffect());

    const squashed = squashAdjustmentsObjects(baseEffect, ...buildingEffects);

    return squashed;
  }
}
