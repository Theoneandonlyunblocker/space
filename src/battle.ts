/// <reference path="battledata.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="eventmanager.ts"/>

module Rance
{
  export class Battle
  {
    unitsById:
    {
      [id: number]: Unit;
    } = {};
    unitsBySide:
    {
      [side: string] : Unit[];
    } =
    {
      side1: [],
      side2: []
    };
    side1: Unit[][];
    side2: Unit[][];

    turnOrder: Unit[] = [];
    activeUnit: Unit;

    maxTurns: number;
    turnsLeft: number;

    ended: boolean = false;

    constructor(units:
    {
      battleData: IBattleData;
      side1: Unit[][];
      side2: Unit[][];
    })
    {
      this.side1 = units.side1;
      this.side2 = units.side2;
    }
    init()
    {
      var self = this;

      ["side1", "side2"].forEach(function(sideId)
      {
        var side = self[sideId];
        for (var i = 0; i < side.length; i++)
        {
          for (var j = 0; j < side[i].length; j++)
          {
            if (side[i][j])
            {
              self.unitsById[side[i][j].id] = side[i][j];
              self.unitsBySide[sideId].push(side[i][j]);

              var pos = sideId === "side1" ? [i, j] : [i+2, j];

              self.initUnit(side[i][j], sideId, pos);
            }
          }
        }
      });

      this.maxTurns = 24;
      this.turnsLeft = this.maxTurns;
      this.updateTurnOrder();
      this.setActiveUnit();

      if (this.checkBattleEnd())
      {
        this.endBattle();
      }
    }
    forEachUnit(operator: (Unit) => any)
    {
      for (var id in this.unitsById)
      {
         operator.call(this, this.unitsById[id]);
      }
    }
    initUnit(unit: Unit, side: string, position: number[])
    {
      unit.resetBattleStats();
      unit.setBattlePosition(this, side, position);
      this.addUnitToTurnOrder(unit);
    }
    removeUnitFromTurnOrder(unit: Unit)
    {
      var unitIndex = this.turnOrder.indexOf(unit);
      if (unitIndex < 0) return false; //not in list

      this.turnOrder.splice(unitIndex, 1);
    }
    addUnitToTurnOrder(unit: Unit)
    {
      var unitIndex = this.turnOrder.indexOf(unit);
      if (unitIndex >= 0) return false; //already in list

      this.turnOrder.push(unit);
    }
    updateTurnOrder()
    {
      this.turnOrder.sort(turnOrderSortFunction);

      function turnOrderFilterFunction(unit: Unit)
      {
        if (unit.battleStats.currentActionPoints <= 0)
        {
          return false;
        }

        if (unit.currentStrength <= 0)
        {
          return false;
        }

        return true;
      }

      this.turnOrder = this.turnOrder.filter(turnOrderFilterFunction);
    }
    setActiveUnit()
    {
      this.activeUnit = this.turnOrder[0];
    }
    endTurn()
    {
      this.turnsLeft--;
      this.updateTurnOrder();
      this.setActiveUnit();

      var shouldEnd = this.checkBattleEnd();
      if (shouldEnd) this.endBattle();
    }
    getFleetsForSide(side: string)
    {
      switch (side)
      {
        case "all":
        {
          return this.side1.concat(this.side2);
        }
        case "side1":
        case "side2":
        {
          return this[side];
        }
      }
    }
    endBattle()
    {
      this.ended = true;

      this.forEachUnit(function(unit)
      {
        if (unit.currentStrength <= 0)
        {
          unit.die();
        }
        unit.resetBattleStats();
      });

      eventManager.dispatchEvent("battleEnd", null);
    }
    finishBattle()
    {
      eventManager.dispatchEvent("switchScene", "galaxyMap");
    }
    getTotalHealthForSide(side: string)
    {
      var health =
      {
        current: 0,
        max: 0
      };

      var units = this.unitsBySide[side];

      for (var i = 0; i < units.length; i++)
      {
        var unit = units[i];
        health.current += unit.currentStrength;
        health.max += unit.maxStrength;
      }

      return health;
    }
    checkBattleEnd()
    {
      if (!this.activeUnit) return true;

      if (this.turnsLeft <= 0) return true;

      if (this.getTotalHealthForSide("side1").current <= 0 ||
        this.getTotalHealthForSide("side2").current <= 0)
      {
        return true;
      }

      return false;
    }
  }
}
