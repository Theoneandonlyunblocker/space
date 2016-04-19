import app from "./App";
import Player from "./Player";
import Unit from "./Unit";
import UnitDisplayData from "./UnitDisplayData";
import getNullFormation from "./getNullFormation";
import ArchetypeValues from "./ArchetypeValues";

export default class BattlePrepFormation
{
  public formation: Unit[][];
  public units: Unit[];
  public minUnits: number;
  public hasScouted: boolean;
  public placedUnitPositionsByID:
  {
    [id: number]: number[];
  } = {};
  
  private player: Player;
  
  private cachedDisplayData: {[unitID: number]: UnitDisplayData};
  private displayDataIsDirty: boolean = true;
  
  constructor(player: Player, units: Unit[], hasScouted: boolean, minUnits?: number)
  {
    this.player = player;
    this.units = units;
    this.hasScouted = hasScouted;
    this.minUnits = minUnits;
  }
  
  public forEachUnitInFormation(f: (unit: Unit, pos?: number[]) => void): void
  {
    for (let i = 0; i < this.formation.length; i++)
    {
      for (let j = 0; j < this.formation[i].length; j++)
      {
        const unit = this.formation[i][j];
        if (unit)
        {
          f(unit, [i, j]);
        }
      }
    }
  }
  public getDisplayData(): {[unitID: number]: UnitDisplayData}
  {
    if (this.displayDataIsDirty)
    {
      this.cachedDisplayData = this.getFormationDisplayData();
      this.displayDataIsDirty = false;
    }
    
    return this.cachedDisplayData;
  }
  public setAutoFormation(enemyUnits?: Unit[], enemyFormation?: Unit[][]): void
  {
    this.clearFormation();
    
    this.formation = this.getAutoFormation(enemyUnits, enemyFormation);
    this.forEachUnitInFormation((unit, pos) =>
    {
      this.placedUnitPositionsByID[unit.id] = pos;
    });
  }
  // human formation stuff
  public getUnitPosition(unit: Unit): number[]
  {
    return this.placedUnitPositionsByID[unit.id];
  }
  getUnitAtPosition(position: number[]): Unit
  {
    return this.formation[position[0]][position[1]];
  }
  public clearFormation(): void
  {
    this.placedUnitPositionsByID = {};
    this.formation = getNullFormation();
  }
  // end human formation stuff
  public isFormationValid(): boolean
  {
    let amountOfUnitsPlaced = 0;
    this.forEachUnitInFormation(unit => amountOfUnitsPlaced += 1);
    const availableUnits = this.units.filter(unit => unit.canActThisTurn());
    const hasPlacedAllAvailableUnits = amountOfUnitsPlaced === availableUnits.length;
    
    return amountOfUnitsPlaced >= this.minUnits || hasPlacedAllAvailableUnits;
  }
  public setUnit(unit: Unit, position?: number[]): void
  {
    const unitInTargetPosition = this.getUnitAtPosition(position);
    if (unitInTargetPosition)
    {
      this.swapUnits(unit, unitInTargetPosition);
    }
    else
    {
      this.removeUnit(unit);
      
      if (!position)
      {
        return;
      }
      const oldUnitPosition = this.getUnitPosition(unit);
      
      this.formation[position[0]][position[1]] = unit;
      this.placedUnitPositionsByID[unit.id] = position;
    }
  }
  public removeUnit(unit: Unit, position = this.getUnitPosition(unit)): void
  {
    if (!position)
    {
      return;
    }
    
    this.formation[position[0]][position[1]] = null;
    delete this.placedUnitPositionsByID[unit.id];
  }
  
  private swapUnits(unit1: Unit, unit2: Unit): void
  {
    if (unit1 === unit2) return;

    var new1Pos = this.getUnitPosition(unit2);
    var new2Pos = this.getUnitPosition(unit1);

    this.setUnit(unit1, new1Pos);
    this.setUnit(unit2, new2Pos);
  }
  private getFormationDisplayData()
  {
    const displayDataByID: {[unitID: number]: UnitDisplayData} = {};
    
    this.forEachUnitInFormation(u =>
    {
      displayDataByID[u.id] = u.getDisplayData("battlePrep");
    });
    
    return displayDataByID;
  }
  // TODO ruleset | handle variable amount of rows
  private getAutoFormation(enemyUnits?: Unit[], enemyFormation?: Unit[][]): Unit[][]
  {
    const scoutedUnits = this.hasScouted ? enemyUnits : null;
    const scoutedFormation = this.hasScouted ? enemyFormation : null;
    
    const formation = getNullFormation();
    const unitsToPlace = this.units.filter(u => u.canActThisTurn());
    
    const maxUnitsPerRow = formation[0].length;
    const maxUnitsPerSide = app.moduleData.ruleSet.battle.maxUnitsPerSide;

    let placedInFront = 0;
    let placedInBack = 0;
    let totalPlaced = 0;
    const unitsPlacedByArchetype: ArchetypeValues = {};

    const getUnitScoreFN = (unit: Unit, row: string) =>
    {
      const baseScore = unit.getStrengthEvaluation();
      
      const archetype = unit.template.archetype;
      const idealMaxUnitsOfArchetype = Math.ceil(maxUnitsPerSide / archetype.idealWeightInBattle);
      const unitsPlacedOfArchetype = unitsPlacedByArchetype[archetype.type] || 0;
      const overMaxOfArchetypeIdeal = Math.max(0, unitsPlacedOfArchetype - idealMaxUnitsOfArchetype);
      const archetypeIdealAdjust = 1 - overMaxOfArchetypeIdeal * 0.15;

      const rowUnits = row === "ROW_FRONT" ? formation[1] : formation[0];
      const rowModifier = archetype.scoreMultiplierForRowFN ?
        archetype.scoreMultiplierForRowFN(row, rowUnits, scoutedUnits, scoutedFormation) : 
        archetype.rowScores[row];
        
      return(
      {
        unit: unit,
        score: baseScore * archetypeIdealAdjust * rowModifier,
        row: row
      });
    }

    while (unitsToPlace.length > 0 && totalPlaced < maxUnitsPerSide)
    {
      const positionScores:
      {
        unit: Unit;
        score: number;
        row: string; // "ROW_FRONT" or "ROW_BACK" // TODO enum
      }[] = [];

      for (let i = 0; i < unitsToPlace.length; i++)
      {
        const unit = unitsToPlace[i];

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
      const topScore = positionScores[0];


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
}