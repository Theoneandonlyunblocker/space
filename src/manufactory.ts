module Rance
{
  export interface IManufacturableThingWithLocations
  {
    thing: IManufacturableThing;
    locations: Star[];
  }
  export interface IManufacturableThingsData
  {
    manufacturable: IManufacturableThingWithLocations[];
    potential: IManufacturableThingWithLocations[];
  }
  export class Manufactory
  {
    buildQueue:
    {
      type: string;
      template: IManufacturableThing;
    }[] = [];

    player: Player;
    star: Star;

    capacity: number;
    maxCapacity: number;

    buildableThings:
    {
      items: Templates.IItemTemplate[];
      units: Templates.IUnitTemplate[];
    };
    buildableThingsAreDirty: boolean = true;

    constructor(star: Star, serializedData?: any)
    {
      this.star = star;
      this.player = star.owner;

      if (serializedData)
      {
        this.makeFromData(serializedData);
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

      while (this.buildQueue.length > 0)
      {
        var thingData = this.buildQueue.shift();
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
    getBuildableUnitTypes(): Templates.IUnitTemplate[]
    {
      var global = this.player.getGloballyBuildableShips();
      var local: Templates.IUnitTemplate[] = [];

      for (var i = 0; i < this.star.buildableUnitTypes.length; i++)
      {
        var type = this.star.buildableUnitTypes[i];
        if (!type.technologyRequirements || this.player.meetsTechnologyRequirements(type.technologyRequirements))
        {
          local.push(type);
        }
      }

      return global.concat(local);
    }
    getBuildableItemTypes(): Templates.IItemTemplate[]
    {
      return this.player.getAllBuildableItems();
    }
    getAllBuildableThings()
    {
      // if (this.buildableThingsAreDirty)
      // {
      //   this.buildableThings =
      //   {
      //     units: this.getBuildableUnitTypes(),
      //     items: this.getBuildableItemTypes()
      //   }
      //   this.buildableThingsAreDirty = false;
      // }
      this.buildableThings =
      {
        units: this.getBuildableUnitTypes(),
        items: this.getBuildableItemTypes()
      }

      return this.buildableThings;
    }
    handleOwnerChange()
    {
      this.player = this.star.owner;
      this.capacity = Math.max(1, this.capacity - 1);
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
