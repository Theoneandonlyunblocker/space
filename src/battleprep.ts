/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="battledata.ts"/>

module Rance
{
  export class BattlePrep
  {
    player: Player;
    enemy: Player;
    battleData: IBattleData;
    availableUnits: Unit[];
    enemyUnits: Unit[];
    fleet: Unit[][];
    alreadyPlaced:
    {
      [id: number]: number[];
    } = {};

    constructor(player: Player, battleData: IBattleData)
    {
      this.player = player;
      this.battleData = battleData;

      this.fleet = this.makeEmptyFleet();

      this.setAvailableUnits();
    }
    setAvailableUnits()
    {
      if (this.battleData.attacker.player === this.player)
      {
        this.availableUnits = this.battleData.attacker.ships;
        this.enemy = this.battleData.defender.player;
        this.enemyUnits = this.battleData.defender.ships;
      }
      else
      {
        this.availableUnits = this.battleData.defender.ships;
        this.enemy = this.battleData.attacker.player;
        this.enemyUnits = this.battleData.attacker.ships;
      }
    }
    makeEmptyFleet()
    {
      var COLUMNS_PER_FLEET = 2;
      var SHIPS_PER_COLUMN = 3;

      var fleet = [];
      for (var i = 0; i < COLUMNS_PER_FLEET; i++)
      {
        var column = [];
        for (var j = 0; j < SHIPS_PER_COLUMN; j++)
        {
          column.push(null);
        }
        fleet.push(column);
      }

      return fleet;
    }

    makeAIFleet(units: Unit[])
    {
      var fleet = this.makeEmptyFleet();
      var alreadyPlaced = 0;

    }

    // TODO
    makeEnemyFleet()
    {
      var fleet = this.makeEmptyFleet();

      for (var i = 0; i < this.enemyUnits.length; i++)
      {
        var d = divmod(i, 3);

        if (d[0] > 1) break;

        fleet[d[0]][d[1]] = this.enemyUnits[i];
      }

      return fleet;
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

    makeBattle()
    {
      var battle = new Battle(
      {
        battleData: this.battleData,
        side1: this.fleet,
        side2: this.makeEnemyFleet(),
        side1Player: this.player,
        side2Player: this.enemy
      });

      battle.init();

      return battle;
    }
  }
}
