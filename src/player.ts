/// <reference path="unit.ts"/>

module Rance
{
  export class Player
  {
    units:
    {
      [id: number]: Unit;
    } = {};


    addUnit(unit: Unit)
    {
      this.units[unit.id] = unit;
    }
  }  
}
