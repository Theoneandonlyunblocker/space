/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="battledata.ts"/>

module Rance
{
  export class BattlePrep
  {
    attacker: Player;
    defender: Player;
    battleData: IBattleData;

    attackerFormation: Unit[][];
    defenderFormation: Unit[][];
    attackerUnits: Unit[];
    defenderUnits: Unit[];

    availableUnits: Unit[];
    enemyUnits: Unit[];

    playerFormation: Unit[][];
    humanPlayer: Player;
    enemyFormation: Unit[][];
    enemyPlayer: Player;
    alreadyPlaced:
    {
      [id: number]: number[];
    } = {};

    minDefendersInNeutralTerritory: number = 1;

    afterBattleFinishCallbacks: Function[] = [];

    constructor(battleData: IBattleData)
    {
      this.attacker = battleData.attacker.player;
      this.attackerUnits = battleData.attacker.ships;
      this.defender = battleData.defender.player;
      this.defenderUnits = battleData.defender.ships;
      this.battleData = battleData;

      this.resetBattleStats();
      this.triggerPassiveSkills();

      this.makeAIFormations();

      this.setupPlayer();
    }
    resetBattleStats()
    {
      var star = this.battleData.location;
      var allUnits = star.getAllShipsOfPlayer(this.attacker).concat(star.getAllShipsOfPlayer(this.defender));

      for (var i = 0; i < allUnits.length; i++)
      {
        allUnits[i].resetBattleStats();
      }
    }
    triggerPassiveSkills()
    {
      var star = this.battleData.location;
      var allUnits = star.getAllShipsOfPlayer(this.attacker).concat(star.getAllShipsOfPlayer(this.defender));
      for (var i = 0; i < allUnits.length; i++)
      {
        var unit = allUnits[i]
        var passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
        if (passiveSkillsByPhase.inBattlePrep)
        {
          for (var j = 0; j < passiveSkillsByPhase.inBattlePrep.length; j++)
          {
            var skill = passiveSkillsByPhase.inBattlePrep[j];
            for (var k = 0; k < skill.inBattlePrep.length; k++)
            {
              skill.inBattlePrep[k](unit, this);
            }
          }
        }
      }
    }
    makeEmptyFormation(): Unit[][]
    {
      var formation: Unit[][] = [];
      for (var i = 0; i < app.moduleData.ruleSet.battle.rowsPerFormation; i++)
      {
        var column: Unit[] = [];
        for (var j = 0; j < app.moduleData.ruleSet.battle.cellsPerRow; j++)
        {
          column.push(null);
        }
        formation.push(column);
      }

      return formation;
    }

    makeAIFormations(): void
    {
      if (this.attacker.isAI)
      {
        this.attackerFormation = this.makeAutoFormation(
          this.battleData.attacker.ships, this.battleData.defender.ships, this.attacker);
      }
      if (this.defender.isAI)
      {
        this.defenderFormation = this.makeAutoFormation(
          this.battleData.defender.ships, this.battleData.attacker.ships, this.defender);
      }
    }

    setupPlayer(): void
    {
      if (!this.attacker.isAI)
      {
        this.availableUnits = this.battleData.attacker.ships;
        this.enemyUnits = this.battleData.defender.ships;
        this.attackerFormation = this.makeEmptyFormation();
        this.playerFormation = this.attackerFormation;
        this.enemyFormation = this.defenderFormation;
        this.humanPlayer = this.attacker;
        this.enemyPlayer = this.defender;
      }
      else if (!this.defender.isAI)
      {
        this.availableUnits = this.battleData.defender.ships;
        this.enemyUnits = this.battleData.attacker.ships;
        this.defenderFormation = this.makeEmptyFormation();
        this.playerFormation = this.defenderFormation;
        this.enemyFormation = this.attackerFormation;
        this.humanPlayer = this.defender;
        this.enemyPlayer = this.attacker;
      }
    }


    // TODO ruleset | handle variable amount of rows
    makeAutoFormation(units: Unit[], enemyUnits: Unit[], player: Player): Unit[][]
    {
      var self = this;
      var maxUnitsPerSide = app.moduleData.ruleSet.battle.maxUnitsPerSide;
      var maxUnitsPerRow = app.moduleData.ruleSet.battle.maxUnitsPerRow;

      var formation = this.makeEmptyFormation();
      var unitsToPlace = units.filter(function(unit: Unit)
      {
        return unit.canActThisTurn();
      });

      var placedInFront = 0;
      var placedInBack = 0;
      var totalPlaced = 0;
      var unitsPlacedByArchetype: IArchetypeValues = {};

      var getUnitScoreFN = function(unit: Unit, row: string)
      {
        var score = unit.getStrengthEvaluation();
        var archetype = unit.template.archetype;
        var rowModifier = archetype.rowScores[row];

        if (archetype.scoreMultiplierForRowFN)
        {
          var rowUnits = row === "ROW_FRONT" ? formation[1] : formation[0];
          var scoutedUnits = player.starIsDetected(self.battleData.location) ? enemyUnits : null;
          rowModifier = archetype.scoreMultiplierForRowFN(row, rowUnits, scoutedUnits);
        }

        var idealMaxUnits = Math.ceil(maxUnitsPerSide / archetype.idealWeightInBattle);
        var unitsPlaced = unitsPlacedByArchetype[archetype.type] || 0;
        var overMax = Math.max(0, unitsPlaced - idealMaxUnits);

        score *= 1 - overMax * 0.15;
        score *= rowModifier;

        return(
        {
          unit: unit,
          score: score,
          row: row
        });
      }

      while (unitsToPlace.length > 0 && totalPlaced < maxUnitsPerSide)
      {
        var positionScores:
        {
          unit: Unit;
          score: number;
          row: string; // "ROW_FRONT" or "ROW_BACK" // TODO enum
        }[] = [];

        for (var i = 0; i < unitsToPlace.length; i++)
        {
          var unit = unitsToPlace[i];

          if (placedInFront < maxUnitsPerRow)
          {
            positionScores.push(getUnitScoreFN(unit, "ROW_FRONT"));
          }
          if (placedInBack < maxUnitsPerRow)
          {
            positionScores.push(getUnitScoreFN(unit, "ROW_BACK"));
          }
        }

        positionScores.sort(function(a, b)
        {
          return (b.score - a.score);
        });
        var topScore = positionScores[0];


        if (topScore.row === "ROW_FRONT")
        {
          placedInFront++;
          formation[1][placedInFront - 1] = topScore.unit;
        }
        else
        {
          placedInBack++;
          formation[0][placedInBack - 1] = topScore.unit;
        }

        totalPlaced++;
        if (!unitsPlacedByArchetype[topScore.unit.template.archetype.type])
        {
          unitsPlacedByArchetype[topScore.unit.template.archetype.type] = 0;
        }
        unitsPlacedByArchetype[topScore.unit.template.archetype.type]++;
        unitsToPlace.splice(unitsToPlace.indexOf(topScore.unit), 1);
      }

      return formation;
    }

    // Human formation stuff

    getUnitPosition(unit: Unit): number[]
    {
      return this.alreadyPlaced[unit.id];
    }
    getUnitAtPosition(position: number[]): Unit
    {
      return this.playerFormation[position[0]][position[1]]
    }
    clearPlayerFormation()
    {
      this.alreadyPlaced = {};
      this.playerFormation = this.makeEmptyFormation();
    }
    // called after player formation is created automatically
    setupPlayerFormation(formation: Unit[][])
    {
      for (var i = 0; i < formation.length; i++)
      {
        for (var j = 0; j < formation[i].length; j++)
        {
          if (formation[i][j])
          {
            this.setUnit(formation[i][j], [i, j]);
          }
        }
      }
    }
    setUnit(unit: Unit, position: number[]): void
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

      this.playerFormation[position[0]][position[1]] = unit;
      this.alreadyPlaced[unit.id] = position;
    }
    swapUnits(unit1: Unit, unit2: Unit): void
    {
      if (unit1 === unit2) return;

      var new1Pos = this.getUnitPosition(unit2);
      var new2Pos = this.getUnitPosition(unit1);

      this.setUnit(unit1, new1Pos);
      this.setUnit(unit2, new2Pos);
    }
    removeUnit(unit: Unit): void
    {
      var currentPosition = this.getUnitPosition(unit);

      if (!currentPosition) return;

      this.playerFormation[currentPosition[0]][currentPosition[1]] = null;

      this.alreadyPlaced[unit.id] = null;
      delete this.alreadyPlaced[unit.id];
    }

    humanFormationIsValid(): boolean
    {
      /*
      invalid if 
        attacking and no ships placed
        battle is in territory not controlled by either and ships placed
          is smaller than requirement and player hasn't placed all available ships
       */
      
      var shipsPlaced = 0;

      this.forEachShipInFormation(this.playerFormation, function(unit: Unit)
      {
        if (unit) shipsPlaced++;
      });

      var minShips: number = 0;

      if (!this.attacker.isAI)
      {
        minShips = 1;
      }
      else if (!this.battleData.building)
      {
        minShips = this.minDefendersInNeutralTerritory;
      }

      minShips = Math.min(minShips, this.availableUnits.length);

      return shipsPlaced >= minShips;
    }

    // end player formation

    forEachShipInFormation(formation: Unit[][], operator: (unit: Unit) => any): void
    {
      for (var i = 0; i < formation.length; i++)
      {
        for (var j = 0; j < formation[i].length; j++)
        {
          operator(formation[i][j]);
        }
      }
    }

    makeBattle(): Battle
    {
      var side1Formation = this.playerFormation || this.attackerFormation;
      var side2Formation = this.enemyFormation || this.defenderFormation;

      var side1Player = this.humanPlayer || this.attacker;
      var side2Player = this.enemyPlayer || this.defender;

      var battle = new Battle(
      {
        battleData: this.battleData,
        side1: side1Formation,
        side2: side2Formation.reverse(),
        side1Player: side1Player,
        side2Player: side2Player
      });

      battle.afterFinishCallbacks = battle.afterFinishCallbacks.concat(this.afterBattleFinishCallbacks);

      battle.init();

      return battle;
    }
  }
}
