import {BuildingEffect, getBaseBuildingEffect} from "./BuildingEffect";

import {Building} from "./Building";
import {squashAdjustmentsObjects} from "./FlatAndMultiplierAdjustment";
import BuildingSaveData from "./savedata/BuildingSaveData";


export class BuildingCollection<T extends Building>
{
  private readonly buildings: T[] = [];
  private cachedEffects: BuildingEffect;
  private cachedEffectsAreDirty: boolean = true;

  /**
   * should be used for non-specific effects
   * eg. vision increasing buildings triggering vision update
   * effects specific to certain building type should be defined in building template
   */
  private readonly onAddBuilding: ((building: T) => void) | undefined;

  constructor(onAddBuilding?: (building: T) => void)
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
    if (this.onAddBuilding)
    {
      this.onAddBuilding(building);
    }
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
  public forEach(callbackFn: (building: T) => void): void
  {
    this.buildings.forEach(callbackFn);
  }
  public map<R>(callbackFn: (building: T) => R): R[]
  {
    return this.buildings.map(callbackFn);
  }
  public toDict(getKeyFn: (building: T) => string): {[key: string]: T[]}
  {
    const dict: {[key: string]: T[]} = {};

    this.forEach(building =>
    {
      const key = getKeyFn(building);

      if (!dict[key])
      {
        dict[key] = [];
      }

      dict[key].push(building);
    });

    return dict;
  }
  public getBuildingsByFamily(): {[key: string]: T[]}
  {
    return this.toDict(building => building.template.family || building.template.type);
  }
  public filter<S extends T>(filterFn: (building: T) => building is S): S[];
  public filter(filterFn: (building: T) => boolean): T[];
  public filter(filterFn: (building: T) => boolean): T[]
  {
    return this.buildings.filter(filterFn);
  }
  public getEffects(): BuildingEffect
  {
    if (this.cachedEffectsAreDirty)
    {
      this.cachedEffects = this.calculateBuildingEffects();
    }

    return this.cachedEffects;
  }
  public handleBuidlingUpgrade(): void
  {
    this.cachedEffectsAreDirty = true;
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
