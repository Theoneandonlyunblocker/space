/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>

module Rance
{
  export class BattlePrep
  {
    player: Player;
    fleet: Unit[][];
    alreadyPlaced:
    {
      [id: number]: number[];
    } = {};

    constructor(player: Player)
    {
      this.player = player;
      this.fleet =
      [
        [null, null, null, null],
        [null, null, null, null]
      ];
    }

    getUnitPosition(unit: Unit)
    {
      return this.alreadyPlaced[unit.id];
    }
    setUnit(unit: Unit, position: number[])
    {
      this.removeUnit(unit);

      this.fleet[position[0]][position[1]] = unit;
      this.alreadyPlaced[unit.id] = position;
    }
    removeUnit(unit: Unit)
    {
      var currentPosition = this.getUnitPosition(unit);

      if (!currentPosition) return;

      this.fleet[currentPosition[0]][currentPosition[1]] = null;

      this.alreadyPlaced[unit.id] = null;
      delete this.alreadyPlaced[unit.id];
    }
  }
}
