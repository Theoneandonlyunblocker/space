import Player from "./Player";
import Unit from "./Unit";
import UnitDisplayData from "./UnitDisplayData";
import getNullFormation from "./getNullFormation";

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
  private isAttacker: boolean;

  private cachedDisplayData: {[unitID: number]: UnitDisplayData};
  private displayDataIsDirty: boolean = true;

  constructor(
    player: Player,
    units: Unit[],
    hasScouted: boolean,
    minUnits: number,
    isAttacker: boolean,
  )
  {
    this.player = player;
    this.units = units;
    this.hasScouted = hasScouted;
    this.minUnits = minUnits;
    this.isAttacker = isAttacker;

    this.formation = getNullFormation();
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

    this.formation = this.player.AIController.createBattleFormation(
      this.units,
      this.hasScouted,
      enemyUnits,
      enemyFormation,
    );
    this.forEachUnitInFormation((unit, pos) =>
    {
      this.placedUnitPositionsByID[unit.id] = pos;
    });
    this.displayDataIsDirty = true;
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
    this.displayDataIsDirty = true;
  }
  // end human formation stuff
  public getFormationValidity(): {isValid: boolean; description: string;}
  {
    let amountOfUnitsPlaced = 0;
    this.forEachUnitInFormation(unit => amountOfUnitsPlaced += 1);

    if (this.isAttacker && amountOfUnitsPlaced < 1)
    {
      return(
      {
        isValid: false,
        description: "Attacker must place at least 1 unit.",
      });
    }

    const availableUnits = this.units.filter(unit => unit.canActThisTurn());
    const hasPlacedAllAvailableUnits = amountOfUnitsPlaced === availableUnits.length;

    if (amountOfUnitsPlaced >= this.minUnits || hasPlacedAllAvailableUnits)
    {
      return(
      {
        isValid: true,
        description: "",
      });
    }
    else
    {
      return(
      {
        isValid: false,
        description: `Must place at least ${this.minUnits} units or all available units.`,
      });
    }
  }
  public setUnit(unit: Unit, position: number[]): void
  {
    const unitInTargetPosition = this.getUnitAtPosition(position);
    if (unitInTargetPosition)
    {
      this.swapUnits(unit, unitInTargetPosition);
    }
    else
    {
      this.removeUnit(unit);

      this.formation[position[0]][position[1]] = unit;
      this.placedUnitPositionsByID[unit.id] = position;
      this.displayDataIsDirty = true;
    }
  }
  public removeUnit(unit: Unit): void
  {
    const position = this.getUnitPosition(unit);
    if (!position)
    {
      return;
    }

    this.formation[position[0]][position[1]] = null;
    delete this.placedUnitPositionsByID[unit.id];
    this.displayDataIsDirty = true;
  }

  private swapUnits(unit1: Unit, unit2: Unit): void
  {
    if (unit1 === unit2) return;

    const new1Pos = this.getUnitPosition(unit2);
    const new2Pos = this.getUnitPosition(unit1);

    this.removeUnit(unit1);
    this.removeUnit(unit2);

    this.setUnit(unit1, new1Pos);
    this.setUnit(unit2, new2Pos);
  }
  private getFormationDisplayData()
  {
    const displayDataByID: {[unitID: number]: UnitDisplayData} = {};

    this.forEachUnitInFormation(unit =>
    {
      displayDataByID[unit.id] = unit.getDisplayData("battlePrep");
    });

    return displayDataByID;
  }
}
