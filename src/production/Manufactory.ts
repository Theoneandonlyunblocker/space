
import {activeModuleData} from "../app/activeModuleData";
import {ItemTemplate} from "../templateinterfaces/ItemTemplate";
import {ManufacturableThing} from "../templateinterfaces/ManufacturableThing";
import {UnitTemplate} from "../templateinterfaces/UnitTemplate";
import {UnlockableThingKind} from "../templateinterfaces/UnlockableThing";

import {ManufactorySaveData} from "../savedata/ManufactorySaveData";

import {Fleet} from "../fleets/Fleet";
import {Item} from "../items/Item";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {Unit} from "../unit/Unit";
import {eventManager} from "../app/eventManager";
import
{
  getUniqueArrayKeys,
} from "../generic/utility";


interface ManufacturableThingWithKind
{
  kind: UnlockableThingKind;
  template: ManufacturableThing;
}
export class Manufactory
{
  public star: Star;
  public buildQueue: ManufacturableThingWithKind[] = [];
  public capacity: number;
  public maxCapacity: number;
  public unitStatsModifier: number = 1;
  public unitHealthModifier: number = 1;

  private get owner(): Player
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
    this.owner.money -= template.buildCost;
  }
  public removeThingAtIndex(index: number): void
  {
    const template = this.buildQueue[index].template;
    this.owner.money += template.buildCost;
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
            race: this.star.localRace,
            attributeMultiplier: this.unitStatsModifier,
            healthMultiplier: this.unitHealthModifier,
          });

          units.push(unit);
          this.owner.addUnit(unit);
          break;
        }
        case "item":
        {
          const itemTemplate = <ItemTemplate> thingData.template;
          const item = new Item(itemTemplate);
          this.owner.addItem(item);
          break;
        }
      }
    }

    if (units.length > 0)
    {
      const fleets = Fleet.createFleetsFromUnits(units);
      fleets.forEach(fleet =>
      {
        this.owner.addFleet(fleet);
        this.star.addFleet(fleet);
      });
    }

    if (!this.owner.isAi)
    {
      eventManager.dispatchEvent("playerManufactoryBuiltThings");
    }
  }
  public getManufacturableUnits(): UnitTemplate[]
  {
    const allUnits = [...this.owner.race.getBuildableUnits(), ...this.getLocalUnitTypes()];
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
    const allItems = [...this.owner.race.getBuildableItems(), ...this.getLocalItemTypes()];
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
  public getCapacityUpgradeCost(): number
  {
    return activeModuleData.ruleSet.manufactory.buildCost * this.capacity;
  }
  public upgradeCapacity(amount: number): void
  {
    // TODO 2017.02.24 | don't think money should get substracted here
    this.owner.money -= this.getCapacityUpgradeCost();
    this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
  }
  public getUnitModifierUpgradeCost(): number
  {
    const totalUpgrades = (this.unitStatsModifier + this.unitHealthModifier - 2) / 0.1;

    return Math.round((totalUpgrades + 1) * 100);
  }
  public upgradeUnitStatsModifier(amount: number): void
  {
    this.owner.money -= this.getUnitModifierUpgradeCost();
    this.unitStatsModifier += amount;
  }
  public upgradeUnitHealthModifier(amount: number): void
  {
    this.owner.money -= this.getUnitModifierUpgradeCost();
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
    return this.star.localRace.getBuildableUnits();
  }
  private getLocalItemTypes(): ItemTemplate[]
  {
    return this.star.localRace.getBuildableItems();
  }
}
