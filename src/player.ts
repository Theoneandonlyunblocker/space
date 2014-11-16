/// <reference path="unit.ts"/>

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
    color: string;

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
  }  
}
