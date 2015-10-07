module Rance
{
  export interface IManufacturableThingWithType
  {
    type: string;
    template: IManufacturableThing;
  }
  export class Manufactory
  {
    buildQueue: IManufacturableThingWithType[] = [];

    player: Player;
    star: Star;

    capacity: number;
    maxCapacity: number;

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
        // manufactorydata temporarily in main.ts

        this.capacity = manufactoryData.startingCapacity;
        this.maxCapacity = manufactoryData.maxCapacity;
      }
    }
    makeFromData(data: any)
    {
      this.capacity = data.capacity;
      this.maxCapacity = data.maxCapacity;
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
    addThingToQueue(template: IManufacturableThing, type: string)
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
            var unitTemplate = <Templates.IUnitTemplate> thingData.template;
            var unit = new Unit(unitTemplate);
            units.push(unit);
            this.player.addUnit(unit);
            break;
          }
          case "item":
          {
            var itemTemplate = <Templates.IItemTemplate> thingData.template;
            var item = new Item(itemTemplate);
            this.player.addItem(item);
            break;
          }
        }
      }

      if (units.length > 0)
      {
        var fleet = new Fleet(this.player, units, this.star);
      }
    }
    getLocalUnitTypes()
    {
      var manufacturable: Templates.IUnitTemplate[] = [];
      var potential: Templates.IUnitTemplate[] = [];

      for (var i = 0; i < this.star.buildableUnitTypes.length; i++)
      {
        var type = this.star.buildableUnitTypes[i];
        if (!type.technologyRequirements || this.player.meetsTechnologyRequirements(type.technologyRequirements))
        {
          manufacturable.push(type);
        }
        else
        {
          potential.push(type);
        }
      }

      return(
      {
        manufacturable: manufacturable,
        potential: potential
      });
    }
    getLocalItemTypes()
    {
      var manufacturable: Templates.IItemTemplate[] = [];
      var potential: Templates.IItemTemplate[] = [];

      // TODO manufactory

      return(
      {
        manufacturable: manufacturable,
        potential: potential
      })
    }
    getManufacturableThingsForType(type: string): IManufacturableThing[]
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
    canManufactureThing(template: IManufacturableThing, type: string)
    {
      var manufacturableThings = this.getManufacturableThingsForType(type);
      return manufacturableThings.indexOf(template) !== -1;
    }
    handleOwnerChange()
    {
      this.player = this.star.owner;
      this.capacity = Math.max(1, this.capacity - 1);
    }
    upgradeCapacity(amount: number)
    {
      this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
    }
    serialize()
    {
      var buildQueue = this.buildQueue.map(function(thingData)
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
        buildQueue: buildQueue
      });
    }
  }
}
