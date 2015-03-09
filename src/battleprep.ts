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

    availableUnits: Unit[];

    playerFormation: Unit[][];
    humanPlayer: Player;
    enemyFormation: Unit[][];
    enemyPlayer: Player;
    alreadyPlaced:
    {
      [id: number]: number[];
    } = {};

    constructor(battleData: IBattleData)
    {
      this.attacker = this.battleData.attacker.player;
      this.defender = this.battleData.defender.player;
      this.battleData = battleData;

      this.makeAIFormations();

      this.setupPlayer();
    }
    makeEmptyFormation(): Unit[][]
    {
      var COLUMNS_PER_FORMATION = 2;
      var SHIPS_PER_COLUMN = 3;

      var formation = [];
      for (var i = 0; i < COLUMNS_PER_FORMATION; i++)
      {
        var column = [];
        for (var j = 0; j < SHIPS_PER_COLUMN; j++)
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
        this.attackerFormation = this.makeAIFormation(this.battleData.attacker.ships);
      }
      if (this.defender.isAI)
      {
        this.defenderFormation = this.makeAIFormation(this.battleData.defender.ships);
      }
    }

    setupPlayer(): void
    {
      if (!this.attacker.isAI)
      {
        this.availableUnits = this.battleData.attacker.ships;
        this.attackerFormation = this.makeEmptyFormation();
        this.playerFormation = this.attackerFormation;
        this.enemyFormation = this.defenderFormation;
        this.humanPlayer = this.attacker;
        this.enemyPlayer = this.defender;
      }
      else if (!this.defender.isAI)
      {
        this.availableUnits = this.battleData.defender.ships;
        this.defenderFormation = this.makeEmptyFormation();
        this.playerFormation = this.attackerFormation;
        this.enemyFormation = this.attackerFormation;
        this.humanPlayer = this.defender;
        this.enemyPlayer = this.attacker;
      }
    }

    

    makeAIFormation(units: Unit[]): Unit[][]
    {
      // todo
      var MAX_UNITS_PER_SIDE = 6;

      var formation = this.makeEmptyFormation();
      var unitsToPlace = units.slice(0);
      var placedInFront = 0;
      var placedInBack = 0;
      var totalPlaced = 0;
      var unitsPlacedByArchetype =
      {
        combat:  0,
        defence: 0,
        magic:   0,
        support: 0,
        utility: 0
      };

      // these are overridden if we run out of units or if alternative
      // units have significantly lower strength
      var maxUnitsPerArchetype =
      {
        combat:  Math.ceil(MAX_UNITS_PER_SIDE / 1),
        defence: Math.ceil(MAX_UNITS_PER_SIDE / 0.5),
        magic:   Math.ceil(MAX_UNITS_PER_SIDE / 0.5),
        support: Math.ceil(MAX_UNITS_PER_SIDE / 0.33),
        utility: Math.ceil(MAX_UNITS_PER_SIDE / 0.33)
      };
      var preferredColumnForArchetype =
      {
        combat: "front",
        defence: "front",
        magic: "back",
        support: "back",
        utility: "back"
      }

      var getUnitScoreFN = function(unit: Unit, row: string, frontRowDefenceBonus: number)
      {
        var score: number = unit.getStrengthEvaluation();

        if (unit.template.archetype === "defence" && row === "front")
        {
          score *= frontRowDefenceBonus;
        }

        return(
        {
          unit: unit,
          score: score,
          row: row
        });
      }

      var getFrontRowDefenceBonusFN = function(threshhold: number): number
      {
        var totalDefenceUnderThreshhold = 0;
        var alreadyHasDefender = false;

        for (var i = 0; i < formation[1].length; i++)
        {
          var unit = formation[1][i];
          totalDefenceUnderThreshhold += Math.max(0, threshhold - unit.attributes.defence);

          if (!alreadyHasDefender && unit.template.archetype === "defence")
          {
            alreadyHasDefender = true;
            totalDefenceUnderThreshhold += 0.5;
          }
        }

        return 1 + totalDefenceUnderThreshhold * 0.25;
      }

      while (unitsToPlace.length > 0 && totalPlaced < MAX_UNITS_PER_SIDE)
      {
        var frontRowDefenceBonus = getFrontRowDefenceBonusFN(6);

        var positionScores:
        {
          unit: Unit;
          score: number;
          row: string; // "front" or "back"
        }[] = [];

        for (var i = 0; i < unitsToPlace.length; i++)
        {
          var unit = unitsToPlace[i];

          positionScores.push(getUnitScoreFN(unit, "front", frontRowDefenceBonus));
          positionScores.push(getUnitScoreFN(unit, "back", frontRowDefenceBonus));
        }

        topScore = positionScores[0];

        var topScore;

        topScore.row === "front" ?
          placedInFront++ :
          placedInBack++;
        totalPlaced++;
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
        battle is in territority not controlled by either and ships placed
          is smaller than requirement
       */
      
      var shipsPlaced = 0;

      this.forEachShipInFormation(this.playerFormation, function(unit: Unit)
      {
        if (unit) shipsPlaced++;
      });

      if (!this.attacker.isAI)
      {
        if (shipsPlaced < 1) return false;
      }

      if (!this.battleData.building)
      {
        var minShips = 1;

        // TODO add passive ability that forces more enemy ships to stay and fight

        if (shipsPlaced < minShips) return false;
      }

      return true;
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

    // TODO
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

      battle.init();

      return battle;
    }
  }
}
