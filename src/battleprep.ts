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
    getUnitAtPosition(position: number[])
    {
      return this.fleet[position[0]][position[1]]
    }
    setUnit(unit: Unit, position: number[])
    {
      this.removeUnit(unit);

      if (!position)
      {
        return;
      }

      var oldUnitInPosition = this.getUnitAtPosition(position);

      if (oldUnitInPosition)
      {
        this.removeUnit(oldUnitInPosition);
      }

      this.fleet[position[0]][position[1]] = unit;
      this.alreadyPlaced[unit.id] = position;
    }
    swapUnits(unit1: Unit, unit2: Unit)
    {
      if (unit1 === unit2) return;

      var new1Pos = this.getUnitPosition(unit2);
      var new2Pos = this.getUnitPosition(unit1);

      this.setUnit(unit1, new1Pos);
      this.setUnit(unit2, new2Pos);
    }
    removeUnit(unit: Unit)
    {
      var currentPosition = this.getUnitPosition(unit);

      if (!currentPosition) return;

      this.fleet[currentPosition[0]][currentPosition[1]] = null;

      this.alreadyPlaced[unit.id] = null;
      delete this.alreadyPlaced[unit.id];
    }

    makeBattle(fleet2: Unit[][])
    {
      var battle = new Battle(
      {
        side1: this.fleet,
        side2: fleet2
      });

      battle.init();

      return battle;
    }
  }
}
