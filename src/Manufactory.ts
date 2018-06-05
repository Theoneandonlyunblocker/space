
import {activeModuleData} from "./activeModuleData";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import ManufacturableThing from "./templateinterfaces/ManufacturableThing";
import UnitTemplate from "./templateinterfaces/UnitTemplate";
import {UnlockableThingKind} from "./templateinterfaces/UnlockableThing";

import ManufactorySaveData from "./savedata/ManufactorySaveData";

import {Fleet} from "./Fleet";
import Item from "./Item";
import Player from "./Player";
import Star from "./Star";
import Unit from "./Unit";
import eventManager from "./eventManager";
import
{
  getUniqueArrayKeys,
} from "./utility";


interface ManufacturableThingWithKind
{
  kind: UnlockableThingKind;
  template: ManufacturableThing;
}
export default class Manufactory
{
  public star: Star;
  public buildQueue: ManufacturableThingWithKind[] = [];
  public capacity: number;
  public maxCapacity: number;
  public unitStatsModifier: number = 1;
  public unitHealthModifier: number = 1;

  private player: Player;

  constructor(star: Star, serializedData?: ManufactorySaveData)
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
  public makeFromData(data: ManufactorySaveData): void
  {
    this.capacity = data.capacity;
    this.maxCapacity = data.maxCapacity;
    this.unitStatsModifier = data.unitStatsModifier;
    this.unitHealthModifier = data.unitHealthModifier;

    this.buildQueue = data.buildQueue.map(savedThing =>
    {
      let templatesString: string;
      switch (savedThing.kind)
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
        kind: savedThing.kind,
        template: activeModuleData.templates[templatesString][savedThing.templateType],
      });
    });
  }
  public queueIsFull(): boolean
  {
    return this.buildQueue.length >= this.capacity;
  }
  public addThingToQueue(template: ManufacturableThing, kind: UnlockableThingKind): void
  {
    this.buildQueue.push({kind: kind, template: template});
    this.player.money -= template.buildCost;
  }
  public removeThingAtIndex(index: number): void
  {
    const template = this.buildQueue[index].template;
    this.player.money += template.buildCost;
    this.buildQueue.splice(index, 1);
  }
  public buildAllThings(): void
  {
    const units: Unit[] = [];

    const toBuild = this.buildQueue.slice(0, this.capacity);
    this.buildQueue = this.buildQueue.slice(this.capacity);

    while (toBuild.length > 0)
    {
      const thingData = toBuild.pop();
      switch (thingData.kind)
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

    if (!this.player.isAi)
    {
      eventManager.dispatchEvent("playerManufactoryBuiltThings");
    }
  }
  public getManufacturableUnits(): UnitTemplate[]
  {
    const allManufacturableUnits = [...this.player.getGloballyBuildableUnits(), ...this.getLocalUnitTypes()];
    const uniqueManufacturableUnits = getUniqueArrayKeys(allManufacturableUnits, unit => unit.type);

    return uniqueManufacturableUnits;
  }
  public getManufacturableItems(): ItemTemplate[]
  {
    const allManufacturableItems = [...this.player.getGloballyBuildableItems(), ...this.getLocalItemTypes()];
    const uniqueManufacturableItems = getUniqueArrayKeys(allManufacturableItems, item => item.type);

    return uniqueManufacturableItems;
  }
  public canManufactureThing<T extends ManufacturableThing>(template: T): boolean
  {
    const allManufacturableThings: ManufacturableThing[] = [...this.getManufacturableUnits(), ...this.getManufacturableItems()];

    return allManufacturableThings.indexOf(template) !== -1;
  }
  public handleOwnerChange(): void
  {
    while (this.buildQueue.length > 0)
    {
      this.removeThingAtIndex(this.buildQueue.length - 1);
    }
    this.player = this.star.owner;
  }
  public getCapacityUpgradeCost(): number
  {
    return activeModuleData.ruleSet.manufactory.buildCost * this.capacity;
  }
  public upgradeCapacity(amount: number): void
  {
    // TODO 2017.02.24 | don't think money should get substracted here
    this.player.money -= this.getCapacityUpgradeCost();
    this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
  }
  public getUnitUpgradeCost(): number
  {
    const totalUpgrades = (this.unitStatsModifier + this.unitHealthModifier - 2) / 0.1;

    return Math.round((totalUpgrades + 1) * 100);
  }
  public upgradeUnitStatsModifier(amount: number): void
  {
    this.player.money -= this.getUnitUpgradeCost();
    this.unitStatsModifier += amount;
  }
  public upgradeUnitHealthModifier(amount: number): void
  {
    this.player.money -= this.getUnitUpgradeCost();
    this.unitHealthModifier += amount;
  }
  public serialize(): ManufactorySaveData
  {
    const buildQueue = this.buildQueue.map(thingData =>
    {
      return(
      {
        kind: thingData.kind,
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

  private getLocalUnitTypes(): UnitTemplate[]
  {
    return this.star.race.getBuildableUnitTypes(this.player);
  }
  private getLocalItemTypes(): ItemTemplate[]
  {
    // not implemented

    return [];
  }
}
