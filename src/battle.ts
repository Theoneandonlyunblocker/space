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
    side1Player: Player;
    side2: Unit[][];
    side2Player: Player;

    battleData: IBattleData;

    turnOrder: Unit[] = [];
    activeUnit: Unit;

    currentTurn: number;
    maxTurns: number;
    turnsLeft: number;

    startHealth:
    {
      side1: number;
      side2: number;
    };

    evaluation:
    {
      [turnNumber: number]: number;
    } = {};

    ended: boolean = false;

    constructor(props:
    {
      battleData: IBattleData;
      side1: Unit[][];
      side2: Unit[][];
      side1Player: Player;
      side2Player: Player;
    })
    {
      this.side1 = props.side1;
      this.side1Player = props.side1Player
      this.side2 = props.side2;
      this.side2Player = props.side2Player;
      this.battleData = props.battleData;
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

      this.currentTurn = 0;
      this.maxTurns = 24;
      this.turnsLeft = this.maxTurns;
      this.updateTurnOrder();
      this.setActiveUnit();

      this.startHealth =
      {
        side1: this.getTotalHealthForSide("side1").current,
        side2: this.getTotalHealthForSide("side2").current
      }

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
      this.currentTurn++;
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
      });

      eventManager.dispatchEvent("battleEnd", null);
    }
    finishBattle()
    {
      this.forEachUnit(function(unit)
      {
        unit.resetBattleStats();
      });
      
      var victor = this.getVictor();
      if (this.battleData.building)
      {
        if (victor)
        {
          this.battleData.building.setController(victor);
        }
      }
      eventManager.dispatchEvent("switchScene", "galaxyMap");
      window.setTimeout(function()
      {
        renderer.camera.centerOnPosition(this.battleData.location);
      }.bind(this), 20);
    }
    getVictor()
    {
      if (this.getTotalHealthForSide("side1").current <= 0)
      {
        return this.side2Player;
      }
      else if (this.getTotalHealthForSide("side2").current <= 0)
      {
        return this.side1Player;
      }

      return null;
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
    getEvaluation()
    {
      if (!this.evaluation[this.currentTurn])
      {
        var self = this;
        var evaluation = 0;

        ["side1", "side2"].forEach(function(side)
        {
          var sign = side === "side1" ? 1 : -1;
          var currentHealth = self.getTotalHealthForSide(side).current;
          if (currentHealth <= 0)
          {
            evaluation += 999 * sign;
            return;
          }
          var currentHealthFactor = currentHealth / self.startHealth[side];
          var lostHealthFactor = 1 - currentHealthFactor;

          for (var i = 0; i < self.unitsBySide[side].length; i++)
          {
            if (self.unitsBySide[side][i].currentStrength <= 0)
            {
              evaluation += 0.1 * sign;
            }
          }

          evaluation += (1 - currentHealthFactor) * sign;
        });

        evaluation = clamp(evaluation, -1, 1);

        this.evaluation[this.currentTurn] = evaluation;
      }

      return this.evaluation[this.currentTurn];
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
