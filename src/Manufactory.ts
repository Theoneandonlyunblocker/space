
import app from "./App"; // TODO global
import ManufacturableThing from "./templateinterfaces/ManufacturableThing";
import UnitTemplate from "./templateinterfaces/UnitTemplate";
import ItemTemplate from "./templateinterfaces/ItemTemplate";

import ManufactorySaveData from "./savedata/ManufactorySaveData";

import Star from "./Star";
import Player from "./Player";
import Unit from "./Unit";
import Item from "./Item";
import Fleet from "./Fleet";
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
      this.capacity = app.moduleData.ruleSet.manufactory.startingCapacity;
      this.maxCapacity = app.moduleData.ruleSet.manufactory.maxCapacity;
    }
  }
  makeFromData(data: any)
  {
    this.capacity = data.capacity;
    this.maxCapacity = data.maxCapacity;
    this.unitStatsModifier = data.unitStatsModifier;
    this.unitHealthModifier = data.unitHealthModifier;

    this.buildQueue = data.buildQueue.map(function(savedThing: any)
    {
      var templatesString: string;
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
        template: app.moduleData.Templates[templatesString][savedThing.templateType]
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
    var template = this.buildQueue[index].template;
    this.player.money += template.buildCost;
    this.buildQueue.splice(index, 1);
  }
  buildAllThings()
  {
    var units: Unit[] = [];

    var toBuild = this.buildQueue.slice(0, this.capacity);
    this.buildQueue = this.buildQueue.slice(this.capacity);

    while (toBuild.length > 0)
    {
      var thingData = toBuild.pop();
      switch (thingData.type)
      {
        case "unit":
        {
          var unitTemplate = <UnitTemplate> thingData.template;
          
          const unit = Unit.fromTemplate(
            unitTemplate,
            this.star.race,
            this.unitStatsModifier,
            this.unitHealthModifier,
          );

          units.push(unit);
          this.player.addUnit(unit);
          break;
        }
        case "item":
        {
          var itemTemplate = <ItemTemplate> thingData.template;
          var item = new Item(itemTemplate);
          this.player.addItem(item);
          break;
        }
      }
    }

    if (units.length > 0)
    {
      new Fleet(this.player, units, this.star);
    }

    if (!this.player.isAI)
    {
      eventManager.dispatchEvent("playerManufactoryBuiltThings");
    }
  }
  getLocalUnitTypes()
  {
    var manufacturable: UnitTemplate[] = [];
    var potential: UnitTemplate[] = [];

    this.star.race.getBuildableUnitTypes(this.player).forEach(unitTemplate =>
    {
      if (!unitTemplate.technologyRequirements ||
        this.player.meetsTechnologyRequirements(unitTemplate.technologyRequirements))
      {
        manufacturable.push(unitTemplate);
      }
      else
      {
        potential.push(unitTemplate);
      }
    })

    return(
    {
      manufacturable: manufacturable,
      potential: potential
    });
  }
  getLocalItemTypes()
  {
    var manufacturable: ItemTemplate[] = [];
    var potential: ItemTemplate[] = [];

    // TODO manufactory | currently no local item types exist

    return(
    {
      manufacturable: manufacturable,
      potential: potential
    })
  }
  getManufacturableThingsForType(type: "item" | "unit"): ManufacturableThing[]
  {
    switch (type)
    {
      case "item":
      {
        return this.getLocalItemTypes().manufacturable;
      }
      case "unit":
      {
        return this.getLocalUnitTypes().manufacturable;
      }
    }
  }
  canManufactureThing(template: ManufacturableThing, type: "item" | "unit")
  {
    var manufacturableThings = this.getManufacturableThingsForType(type);
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
    return app.moduleData.ruleSet.manufactory.buildCost * this.capacity;
  }
  upgradeCapacity(amount: number)
  {
    this.player.money -= this.getCapacityUpgradeCost();
    this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
  }
  getUnitUpgradeCost()
  {
    var totalUpgrades = (this.unitStatsModifier + this.unitHealthModifier - 2) / 0.1;
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
    var buildQueue = this.buildQueue.map(function(thingData: ManufacturableThingWithType)
    {
      return(
      {
        type: thingData.type,
        templateType: thingData.template.type
      });
    });

    return(
    {
      capacity: this.capacity,
      maxCapacity: this.maxCapacity,
      unitStatsModifier: this.unitStatsModifier,
      unitHealthModifier: this.unitHealthModifier,
      buildQueue: buildQueue
    });
  }
}
