import Unit from "./Unit.ts";
import Player from "./Player.ts";
import Battle from "./Battle.ts";
import BattleData from "./BattleData.d.ts";

export default class BattlePrep
{
  attacker: Player;
  defender: Player;
  battleData: BattleData;

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

  constructor(battleData: BattleData)
  {
    this.attacker = battleData.attacker.player;
    this.attackerUnits = battleData.attacker.units;
    this.defender = battleData.defender.player;
    this.defenderUnits = battleData.defender.units;
    this.battleData = battleData;

    this.resetBattleStats();
    this.triggerPassiveSkills();

    this.makeAIFormations();

    this.setupPlayer();
  }
  resetBattleStats()
  {
    var star = this.battleData.location;
    var allUnits = star.getAllUnitsOfPlayer(this.attacker).concat(star.getAllUnitsOfPlayer(this.defender));

    for (var i = 0; i < allUnits.length; i++)
    {
      allUnits[i].resetBattleStats();
    }
  }
  triggerPassiveSkills()
  {
    var star = this.battleData.location;
    var allUnits = star.getAllUnitsOfPlayer(this.attacker).concat(star.getAllUnitsOfPlayer(this.defender));
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
      var row: Unit[] = [];
      for (var j = 0; j < app.moduleData.ruleSet.battle.cellsPerRow; j++)
      {
        row.push(null);
      }
      formation.push(row);
    }

    return formation;
  }

  makeAIFormations(): void
  {
    if (this.attacker.isAI)
    {
      this.attackerFormation = this.makeAutoFormation(
        this.battleData.attacker.units, this.battleData.defender.units, this.attacker);
    }
    if (this.defender.isAI)
    {
      this.defenderFormation = this.makeAutoFormation(
        this.battleData.defender.units, this.battleData.attacker.units, this.defender);
    }
  }

  setupPlayer(): void
  {
    if (!this.attacker.isAI)
    {
      this.availableUnits = this.battleData.attacker.units;
      this.enemyUnits = this.battleData.defender.units;
      this.attackerFormation = this.makeEmptyFormation();
      this.playerFormation = this.attackerFormation;
      this.enemyFormation = this.defenderFormation;
      this.humanPlayer = this.attacker;
      this.enemyPlayer = this.defender;
    }
    else if (!this.defender.isAI)
    {
      this.availableUnits = this.battleData.defender.units;
      this.enemyUnits = this.battleData.attacker.units;
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
    var unitsPlacedByArchetype: ArchetypeValues = {};

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
      attacking and no units placed
      battle is in territory not controlled by either and units placed
        is smaller than requirement and player hasn't placed all available units
     */
    
    var unitsPlaced = 0;

    this.forEachUnitInFormation(this.playerFormation, function(unit: Unit)
    {
      if (unit) unitsPlaced++;
    });

    var minRequiredUnits: number = 0;

    if (!this.attacker.isAI)
    {
      minRequiredUnits = 1;
    }
    else if (!this.battleData.building)
    {
      minRequiredUnits = this.minDefendersInNeutralTerritory;
    }

    minRequiredUnits = Math.min(minRequiredUnits, this.availableUnits.length);

    return unitsPlaced >= minRequiredUnits;
  }

  // end player formation

  forEachUnitInFormation(formation: Unit[][], operator: (unit: Unit) => any): void
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
