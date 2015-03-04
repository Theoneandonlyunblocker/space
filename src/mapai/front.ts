/// <reference path="../unit.ts"/>
/// <reference path="../star.ts"/>

module Rance
{
  export class Front
  {
    id: number;
    priority: number;
    units: Unit[];

    minUnitsDesired: number;
    idealUnitsDesired: number;

    targetLocation: Star;
    musterLocation: Star;

    constructor(props:
    {
      id: number;
      priority: number;
      units: Unit[];
      
      minUnitsDesired: number;
      idealUnitsDesired: number;

      targetLocation: Star;
      musterLocation: Star;
    })
    {
      this.id = props.id;
      this.priority = props.priority;
      this.units = props.units;

      this.minUnitsDesired = props.minUnitsDesired;
      this.idealUnitsDesired = props.idealUnitsDesired;

      this.targetLocation = props.targetLocation;
      this.musterLocation = props.musterLocation;
    }

    getUnitIndex(unit: Unit)
    {
      return this.units.indexOf(unit);
    }
    addUnit(unit: Unit)
    {
      if (this.getUnitIndex(unit) !== -1)
      {
        this.units.push(unit);
      }
    }
    removeUnit(unit: Unit)
    {
      var unitIndex = this.getUnitIndex(unit);
      if (unitIndex !== -1)
      {
        this.units.splice(unitIndex, 1);
      }
    }
    getUnitCountByArchetype()
    {
      var unitCountByArchetype:
      {
        [archetype: string]: number;
      } = {};

      for (var i = 0; i < this.units.length; i++)
      {
        var archetype = this.units[i].template.archetype;
        
        if (!unitCountByArchetype[archetype])
        {
          unitCountByArchetype[archetype] = 0;
        }

        unitCountByArchetype[archetype]++;
      }

      return unitCountByArchetype;
    }
  }
}
