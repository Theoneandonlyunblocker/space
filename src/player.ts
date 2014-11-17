/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.player = idGenerators.player || 0;

  export class Player
  {
    id: number;
    units:
    {
      [id: number]: Unit;
    } = {};
    fleets: Fleet[] = [];
    color: number;

    constructor(id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.player++;
    }


    addUnit(unit: Unit)
    {
      this.units[unit.id] = unit;
    }
    getAllUnits()
    {
      var allUnits = [];
      for (var unitId in this.units)
      {
        allUnits.push(this.units[unitId]);
      }
      return allUnits;
    }
    getFleetIndex(fleet: Fleet)
    {
      return this.fleets.indexOf(fleet);
    }
    addFleet(fleet: Fleet)
    {
      if (this.getFleetIndex(fleet) >= 0)
      {
        return;
      }

      this.fleets.push(fleet);
    }
    removeFleet(fleet: Fleet)
    {
      var fleetIndex = this.getFleetIndex(fleet);

      if (fleetIndex <= 0)
      {
        return;
      }

      this.fleets.splice(fleetIndex, 1);
    }
    getFleetsWithPositions()
    {
      var positions = [];

      for (var i = 0; i < this.fleets.length; i++)
      {
        var fleet = this.fleets[i];

        positions.push(
        {
          position: fleet.location,
          data: fleet
        });
      }

      return positions;
    }
  }  
}
