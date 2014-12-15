/// <reference path="battle.ts"/>
/// <reference path="unitstate.ts"/>

module Rance
{
  export class BattleState
  {
    side1: UnitState[][];
    side2: UnitState[][];

    activeUnit: UnitState;
    turnOrder: UnitState[];
    turnsLeft: number;

    side1StartHealth: number;
    side2StartHealth: number;

    constructor(battle: Battle)
    {
      var allUnits = this.initUnitStates(battle);

      this.turnOrder = battle.turnOrder.map(function(unit)
      {
        return allUnits[unit.id];
      });
      this.activeUnit = this.turnOrder[0];

      this.turnsLeft = battle.turnsLeft;

      this.side1StartHealth = battle.startHealth.side1;
      this.side2StartHealth = battle.startHealth.side2;

    }
    initUnitStates(battle: Battle)
    {
      var self = this;
      var allUnits:
      {
        [id: number]: UnitState;
      } = {};
      ["side1", "side2"].forEach(function(side)
      {
        self[side] = [];
        for (var i = 0; i < battle[side].length; i++)
        {
          var battleColumn = battle[side][i];
          var selfColumn = [];

          for (var j = 0; j < battleColumn.length; j++)
          {
            if (!battleColumn[j])
            {
              selfColumn.push(null);
              continue;
            }

            var unitState = new UnitState(battleColumn[j]);
            selfColumn.push(unitState);
            allUnits[unitState.id] = unitState;
          }


          self[side].push(selfColumn);
        }
      });

      return allUnits;
    }

  }
}