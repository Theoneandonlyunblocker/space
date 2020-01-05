
import {activeModuleData} from "../app/activeModuleData";
import {ItemTemplate} from "../templateinterfaces/ItemTemplate";
import {ManufacturableThing, ManufacturableThingKind} from "../templateinterfaces/ManufacturableThing";
import {UnitTemplate} from "../templateinterfaces/UnitTemplate";

import {ManufactorySaveData} from "../savedata/ManufactorySaveData";

import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {eventManager} from "../app/eventManager";
import
{
  getUniqueArrayKeys,
} from "../generic/utility";
import { getBuildableUnitsForRace } from "./getBuildableUnitsForRace";
import { getBuildableItemsForRace } from "./getBuildableItemsForRace";
import { Resources } from "../player/PlayerResources";


interface ManufacturableThingWithKind<Template extends ManufacturableThing, BuiltThing, SaveData>
{
  kind: ManufacturableThingKind<Template, BuiltThing, SaveData>;
  template: Template;
}
interface BuiltThingsWithKind<Template extends ManufacturableThing, BuiltThing, SaveData>
{
  kind: ManufacturableThingKind<Template, BuiltThing, SaveData>;
  builtThings: BuiltThing[];
}
export class Manufactory
{
  public star: Star;
  public buildQueue: ManufacturableThingWithKind<any, any, any>[] = [];
  public capacity: number;
  public maxCapacity: number;
  public get owner(): Player
  {
    return this.star.owner;
  }

  constructor(star: Star, serializedData?: ManufactorySaveData)
  {
    this.star = star;

    if (serializedData)
    {
      this.makeFromData(serializedData);
    }
    else
    {
      this.capacity = activeModuleData.ruleSet.manufactory.startingCapacity;
      this.maxCapacity = activeModuleData.ruleSet.manufactory.maxCapacity;
    }
  }
  public static getBuildCost(): Resources
  {
    return {
      money: activeModuleData.ruleSet.manufactory.buildCost,
    };
  }
  public makeFromData(data: ManufactorySaveData): void
  {
    this.capacity = data.capacity;
    this.maxCapacity = data.maxCapacity;

    this.buildQueue = data.buildQueue.map(savedThing =>
    {
      const kind = activeModuleData.manufacturableThingKinds[savedThing.kind];

      return(
      {
        kind: kind,
        template: kind.deserialize(savedThing.data),
      });
    });
  }
  public queueIsFull(): boolean
  {
    return this.buildQueue.length >= this.capacity;
  }
  public addThingToQueue<T extends ManufacturableThing, B, S>(template: T, kind: ManufacturableThingKind<T, B, S>): void
  {
    this.buildQueue.push({kind: kind, template: template});
    this.owner.removeResources(template.buildCost);
  }
  public removeThingAtIndex(index: number): void
  {
    const template = this.buildQueue[index].template;
    this.owner.addResources(template.buildCost);
    this.buildQueue.splice(index, 1);
  }
  public clearBuildingQueue(): void
  {
    while (this.buildQueue.length > 0)
    {
      this.removeThingAtIndex(this.buildQueue.length - 1);
    }
  }
  public buildAllThings(): void
  {
    const builtThingsByKind:
    {
      [key: string]: BuiltThingsWithKind<any, any, any>;
    } = {};

    const toBuild = this.buildQueue.slice(0, this.capacity);
    this.buildQueue = this.buildQueue.slice(this.capacity);

    while (toBuild.length > 0)
    {
      const thingData = toBuild.pop();
      const kind = thingData.kind;

      const built = kind.buildFromTemplate(thingData.template, this);

      if (!builtThingsByKind[kind.key])
      {
        builtThingsByKind[kind.key] =
        {
          kind: kind,
          builtThings: [],
        };
      }
      builtThingsByKind[kind.key].builtThings.push(built);
    }

    for (const key in builtThingsByKind)
    {
      const kind = builtThingsByKind[key].kind;
      const builtThings = builtThingsByKind[key].builtThings;

      kind.afterBuilt(builtThings, this);
    }

    if (!this.owner.isAi)
    {
      eventManager.dispatchEvent("playerManufactoryBuiltThings");
    }
  }
  public getManufacturableUnits(): UnitTemplate[]
  {
    const allUnits =
    [
      ...getBuildableUnitsForRace(this.owner.race),
      ...getBuildableUnitsForRace(this.star.localRace),
    ];
    const uniqueUnits = getUniqueArrayKeys(allUnits, unit => unit.type);

    const manufacturableUnits = uniqueUnits.filter(unitTemplate =>
    {
      return !unitTemplate.techRequirements ||
        this.owner.meetsTechRequirements(unitTemplate.techRequirements);
    });

    return manufacturableUnits;
  }
  public getManufacturableItems(): ItemTemplate[]
  {
    const allItems =
    [
      ...getBuildableItemsForRace(this.owner.race),
      ...getBuildableItemsForRace(this.star.localRace),
    ];
    const uniqueItems = getUniqueArrayKeys(allItems, item => item.type);

    const manufacturableItems = uniqueItems.filter(itemTemplate =>
      {
        return !itemTemplate.techRequirements ||
          this.owner.meetsTechRequirements(itemTemplate.techRequirements);
      });

    return manufacturableItems;
  }
  public handleOwnerChange(): void
  {
    this.clearBuildingQueue();
  }
  public getCapacityUpgradeCost(): Resources
  {
    return {
      money: activeModuleData.ruleSet.manufactory.buildCost * this.capacity,
    };
  }
  public upgradeCapacity(amount: number): void
  {
    // TODO 2017.02.24 | don't think money should get substracted here
    this.owner.removeResources(this.getCapacityUpgradeCost());
    this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
  }
  public serialize(): ManufactorySaveData
  {
    const buildQueueData = this.buildQueue.map(manufacturableThingWithKind =>
    {
      return(
      {
        kind: manufacturableThingWithKind.kind.key,
        data: manufacturableThingWithKind.kind.serialize(manufacturableThingWithKind.template),
      });
    });

    return(
    {
      capacity: this.capacity,
      maxCapacity: this.maxCapacity,
      buildQueue: buildQueueData,
    });
  }
}
