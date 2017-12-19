
import {activeModuleData} from "./activeModuleData";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import ManufacturableThing from "./templateinterfaces/ManufacturableThing";
import UnitTemplate from "./templateinterfaces/UnitTemplate";

import ManufactorySaveData from "./savedata/ManufactorySaveData";

import {Fleet} from "./Fleet";
import Item from "./Item";
import Player from "./Player";
import Star from "./Star";
import Unit from "./Unit";
import eventManager from "./eventManager";

interface ManufacturableThingWithType
{
  type: string;
  template: ManufacturableThing;
}
export default class Manufactory
{
  buildQueue: ManufacturableThingWithType[] = [];

  player: Player;
  star: Star;

  capacity: number;
  maxCapacity: number;

  unitStatsModifier: number = 1;
  unitHealthModifier: number = 1;

  constructor(star: Star, serializedData?: any)
  {
    this.star = star;
    this.player = star.owner;

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
  public static getBuildCost(): number
  {
    return activeModuleData.ruleSet.manufactory.buildCost;
  }
  makeFromData(data: any)
  {
    this.capacity = data.capacity;
    this.maxCapacity = data.maxCapacity;
    this.unitStatsModifier = data.unitStatsModifier;
    this.unitHealthModifier = data.unitHealthModifier;

    this.buildQueue = data.buildQueue.map(function(savedThing: any)
    {
      let templatesString: string;
      switch (savedThing.type)
      {
        case "unit":
        {
          templatesString = "Units";
          break;
        }
        case "item":
        {
          templatesString = "Items";
        }
      }

      return(
      {
        type: savedThing.type,
        template: activeModuleData.Templates[templatesString][savedThing.templateType],
      });
    });
  }
  queueIsFull()
  {
    return this.buildQueue.length >= this.capacity;
  }
  addThingToQueue(template: ManufacturableThing, type: string)
  {
    this.buildQueue.push({type: type, template: template});
    this.player.money -= template.buildCost;
  }
  removeThingAtIndex(index: number)
  {
    const template = this.buildQueue[index].template;
    this.player.money += template.buildCost;
    this.buildQueue.splice(index, 1);
  }
  buildAllThings()
  {
    const units: Unit[] = [];

    const toBuild = this.buildQueue.slice(0, this.capacity);
    this.buildQueue = this.buildQueue.slice(this.capacity);

    while (toBuild.length > 0)
    {
      const thingData = toBuild.pop();
      switch (thingData.type)
      {
        case "unit":
        {
          const unitTemplate = <UnitTemplate> thingData.template;

          const unit = Unit.fromTemplate(
          {
            template: unitTemplate,
            race: this.star.race,
            attributeMultiplier: this.unitStatsModifier,
            healthMultiplier: this.unitHealthModifier,
          });

          units.push(unit);
          this.player.addUnit(unit);
          break;
        }
        case "item":
        {
          const itemTemplate = <ItemTemplate> thingData.template;
          const item = new Item(itemTemplate);
          this.player.addItem(item);
          break;
        }
      }
    }

    if (units.length > 0)
    {
      const fleets = Fleet.createFleetsFromUnits(units);
      fleets.forEach(fleet =>
      {
        this.player.addFleet(fleet);
        this.star.addFleet(fleet);
      });
    }

    if (!this.player.isAI)
    {
      eventManager.dispatchEvent("playerManufactoryBuiltThings");
    }
  }
  getLocalUnitTypes(): UnitTemplate[]
  {
    return this.star.race.getBuildableUnitTypes(this.player);
  }
  getLocalItemTypes(): ItemTemplate[]
  {
    // currently no local item types exist

    return [];
  }
  public getUniqueLocalUnitTypes(alreadyAdded: UnitTemplate[] = []): UnitTemplate[]
  {
    return this.getUniqueLocalManufacturableThings(alreadyAdded, "unit");
  }
  public getUniqueLocalItemTypes(alreadyAdded: ItemTemplate[] = []): ItemTemplate[]
  {
    return this.getUniqueLocalManufacturableThings(alreadyAdded, "item");
  }
  private getUniqueLocalManufacturableThings<T extends ManufacturableThing>(
    alreadyAdded: T[],
    type: "item" | "unit",
    ): T[]
  {
    const alreadyAddedTypes:
    {
      [type: string]: boolean;
    } = {};

    alreadyAdded.forEach(manufacturableThing =>
    {
      alreadyAddedTypes[manufacturableThing.type] = true;
    });

    const localManufacturableThings = <T[]> this.getManufacturableThingsForType(type);

    return localManufacturableThings.filter(manufacturableThing =>
    {
      return !alreadyAddedTypes[manufacturableThing.type];
    });
  }
  getManufacturableThingsForType(type: "item" | "unit"): ManufacturableThing[]
  {
    switch (type)
    {
      case "item":
      {
        return this.getLocalItemTypes();
      }
      case "unit":
      {
        return this.getLocalUnitTypes();
      }
    }
  }
  canManufactureThing(template: ManufacturableThing, type: "item" | "unit")
  {
    const manufacturableThings = this.getManufacturableThingsForType(type);
    return manufacturableThings.indexOf(template) !== -1;
  }
  handleOwnerChange()
  {
    while (this.buildQueue.length > 0)
    {
      this.removeThingAtIndex(this.buildQueue.length - 1);
    }
    this.player = this.star.owner;
    this.capacity = Math.max(1, this.capacity - 1);
  }
  getCapacityUpgradeCost()
  {
    return activeModuleData.ruleSet.manufactory.buildCost * this.capacity;
  }
  upgradeCapacity(amount: number)
  {
    // TODO 2017.02.24 | don't think money should get substracted here
    this.player.money -= this.getCapacityUpgradeCost();
    this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
  }
  getUnitUpgradeCost()
  {
    const totalUpgrades = (this.unitStatsModifier + this.unitHealthModifier - 2) / 0.1;
    return Math.round((totalUpgrades + 1) * 100);
  }
  upgradeUnitStatsModifier(amount: number)
  {
    this.player.money -= this.getUnitUpgradeCost();
    this.unitStatsModifier += amount;
  }
  upgradeUnitHealthModifier(amount: number)
  {
    this.player.money -= this.getUnitUpgradeCost();
    this.unitHealthModifier += amount;
  }
  serialize(): ManufactorySaveData
  {
    const buildQueue = this.buildQueue.map(function(thingData: ManufacturableThingWithType)
    {
      return(
      {
        type: thingData.type,
        templateType: thingData.template.type,
      });
    });

    return(
    {
      capacity: this.capacity,
      maxCapacity: this.maxCapacity,
      unitStatsModifier: this.unitStatsModifier,
      unitHealthModifier: this.unitHealthModifier,
      buildQueue: buildQueue,
    });
  }
}
