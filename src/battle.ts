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

    evaluation: //-1: side1 win, 0: even, 1: side2 win
    {
      [turnNumber: number]: number;
    } = {};

    isSimulated: boolean = false; // true when battle is between two
                                  // ai players
    isVirtual: boolean = false; // true when a clone made by battle ai
    ended: boolean = false;

    capturedUnits: Unit[];
    deadUnits: Unit[];

    afterFinishCallbacks: any[] = [];

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
      else
      {
        this.swapColumnsIfNeeded();
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
      unit.timesActedThisTurn++;
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

        if (unit.currentHealth <= 0)
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

      if (!this.isVirtual)
      {
        this.forEachUnit(function(unit)
        {
          if (unit.currentHealth <= 0)
          {
            unit.displayFlags.isAnnihilated = true;
            unit.uiDisplayIsDirty = true;
          }
        });
      }

      var shouldEnd = this.checkBattleEnd();
      if (shouldEnd)
      {
        this.endBattle();
      }
      else
      {
        this.swapColumnsIfNeeded();
      }
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
    getPlayerForSide(side: string)
    {
      if (side === "side1") return this.side1Player;
      else if (side === "side2") return this.side2Player;
      else throw new Error("invalid side");
    }
    getSideForPlayer(player: Player)
    {
      if (this.side1Player === player) return "side1";
      else if (this.side2Player === player) return "side2";
      else throw new Error("invalid player");
    }
    getActivePlayer()
    {
      if (!this.activeUnit) return null;

      var side = this.activeUnit.battleStats.side;

      return this.getPlayerForSide(side);
    }
    getColumnByPosition(position: number)
    {
      var side = position <= 1 ? "side1" : "side2";
      var relativePosition = position % 2;

      return this[side][relativePosition];
    }
    getCapturedUnits(victor: Player, maxCapturedUnits: number = 1)
    {
      if (!victor || victor.isIndependent) return [];

      var winningSide = this.getSideForPlayer(victor);
      var losingSide = reverseSide(winningSide);

      var losingUnits = this.unitsBySide[losingSide].slice(0);
      losingUnits.sort(function(a, b)
      {
        return b.battleStats.captureChance - a.battleStats.captureChance;
      });

      var capturedUnits: Unit[] = [];

      for (var i = 0; i < losingUnits.length; i++)
      {
        if (capturedUnits.length >= maxCapturedUnits) break;

        var unit = losingUnits[i];
        if (unit.currentHealth <= 0 &&
          Math.random() <= unit.battleStats.captureChance)
        {
          capturedUnits.push(unit);
        }
      }

      return capturedUnits;
    }
    getDeadUnits(capturedUnits: Unit[], victor: Player)
    {
      var INDEPENDENT_DEATH_CHANCE = 1;
      var PLAYER_DEATH_CHANCE = 0.4;
      var LOSER_DEATH_CHANCE = 0.25;

      var winningSide = this.getSideForPlayer(victor);
      var losingSide = reverseSide(winningSide);
      var losingPlayer = this.getPlayerForSide(losingSide);

      var deadUnits: Unit[] = [];


      this.forEachUnit(function(unit)
      {
        
        if (unit.currentHealth <= 0)
        {
          var wasCaptured = capturedUnits.indexOf(unit) >= 0;
          if (!wasCaptured)
          {
            var isIndependent = unit.fleet.player.isIndependent;
            var deathChance = isIndependent ? INDEPENDENT_DEATH_CHANCE : PLAYER_DEATH_CHANCE;
            if (unit.fleet.player.id === losingPlayer) deathChance += LOSER_DEATH_CHANCE;

            if (Math.random() <= deathChance)
            {
              deadUnits.push(unit);
            }
          }
        }
      });

      return deadUnits;
    }
    endBattle()
    {
      this.ended = true;

      if (this.isVirtual) return;

      this.activeUnit = null;
      var victor = this.getVictor();

      this.capturedUnits = this.getCapturedUnits(victor);
      this.deadUnits = this.getDeadUnits(this.capturedUnits, victor);



      var _ : any = window;

      var consoleRows = [];
      this.forEachUnit(function(unit)
      {
        consoleRows.push(
        {
          id: unit.id,
          health: unit.currentHealth,
          destroyed: this.deadUnits.indexOf(unit) >= 0 ? true : null,
          captureChance: unit.battleStats.captureChance,
          captured: this.capturedUnits.indexOf(unit) >= 0 ? true : null
        });
      }.bind(this));

      if (_.console.table)
      {
        _.console.table(consoleRows);
      }



      eventManager.dispatchEvent("battleEnd", null);
    }
    finishBattle(forcedVictor?: Player)
    {
      var victor = forcedVictor || this.getVictor();

      for (var i = 0; i < this.deadUnits.length; i++)
      {
        this.deadUnits[i].removeFromPlayer();
      }

      if (victor)
      {
        for (var i = 0; i < this.capturedUnits.length; i++)
        {
          this.capturedUnits[i].transferToPlayer(victor);
        }
      }
      
      
      this.forEachUnit(function(unit)
      {
        unit.resetBattleStats();
      });
      this.forEachUnit(function(unit)
      {
        if (unit.currentHealth < Math.round(unit.maxHealth * 0.1))
        {
          unit.currentHealth = Math.round(unit.maxHealth * 0.1);
        }
      });
      
      if (this.battleData.building)
      {
        if (victor)
        {
          this.battleData.building.setController(victor);
        }
      }
      for (var i = 0; i < this.afterFinishCallbacks.length; i++)
      {
        this.afterFinishCallbacks[i]();
      }
      if (!this.isSimulated)
      {
        eventManager.dispatchEvent("switchScene", "galaxyMap");
        eventManager.dispatchEvent("centerCameraAt", this.battleData.location);
      }
    }
    getVictor()
    {
      var evaluation = this.getEvaluation();

      if (evaluation < 0) return this.side1Player;
      else if (evaluation > 0) return this.side2Player;
      else return null;
    }
    getTotalHealthForColumn(position: number)
    {
      var column = this.getColumnByPosition(position);
      var total = 0;

      for (var i = 0; i < column.length; i++)
      {
        if (column[i])
        {
          total += column[i].currentHealth;
        }
      }

      return total;
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
        health.current += unit.currentHealth;
        health.max += unit.maxHealth;
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
            if (self.unitsBySide[side][i].currentHealth <= 0)
            {
              evaluation += 0.2 * sign;
            }
          }

          evaluation += (1 - currentHealthFactor) * sign;
        });

        evaluation = clamp(evaluation, -1, 1);

        this.evaluation[this.currentTurn] = evaluation;
      }

      return this.evaluation[this.currentTurn];
    }
    swapFleetColumnsForSide(side: string)
    {
      this[side] = this[side].reverse();

      for (var i = 0; i < this[side].length; i++)
      {
        var column = this[side][i];
        for (var j = 0; j < column.length; j++)
        {
          var pos = side === "side1" ? [i, j] : [i+2, j];

          if (column[j])
          {
            column[j].setBattlePosition(this, side, pos);
          }
        }
      }
    }
    swapColumnsIfNeeded()
    {
      var side1Front = this.getTotalHealthForColumn(1);
      if (side1Front <= 0)
      {
        this.swapFleetColumnsForSide("side1");
      }
      var side2Front = this.getTotalHealthForColumn(2);
      if (side2Front <= 0)
      {
        this.swapFleetColumnsForSide("side2");
      }
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
    makeVirtualClone(): Battle
    {
      var battleData = this.battleData;


      function cloneUnits(units)
      {
        var clones = [];
        for (var i = 0; i < units.length; i++)
        {
          var column: Unit[] = [];

          for (var j = 0; j < units[i].length; j++)
          {
            var unit = units[i][j];
            if (!unit)
            {
              column.push(unit);
            }
            else
            {
              column.push(unit.makeVirtualClone());
            }
          }
          clones.push(column);
        }

        return clones;
      }

      var side1 = cloneUnits(this.side1);
      var side2 = cloneUnits(this.side2);

      var side1Player = this.side1Player;
      var side2Player = this.side2Player;

      var clone = new Battle(
      {
        battleData: battleData,
        side1: side1,
        side2: side2,
        side1Player: side1Player,
        side2Player: side2Player
      });

      [side1, side2].forEach(function(side)
      {
        for (var i = 0; i < side.length; i++)
        {
          for (var j = 0; j < side[i].length; j++)
          {
            if (!side[i][j]) continue;
            clone.addUnitToTurnOrder(side[i][j]);
            clone.unitsById[side[i][j].id] = side[i][j];
            clone.unitsBySide[side[i][j].battleStats.side].push(side[i][j]);
          }
        }
      });

      clone.isVirtual = true;

      clone.currentTurn = 0;
      clone.maxTurns = 24;
      clone.turnsLeft = clone.maxTurns;
      clone.updateTurnOrder();
      clone.setActiveUnit();

      clone.startHealth =
      {
        side1: clone.getTotalHealthForSide("side1").current,
        side2: clone.getTotalHealthForSide("side2").current
      }

      if (clone.checkBattleEnd())
      {
        clone.endBattle();
      }
      else
      {
        clone.swapColumnsIfNeeded();
      }

      return clone;
    }
  }
}
