import {TurnOrderDisplayData} from "./TurnOrderDisplayData";
import {Unit} from "./Unit";


export class BattleTurnOrder
{
  private allUnits: Unit[] = [];
  private orderedUnits: Unit[] = [];

  constructor()
  {

  }
  public destroy(): void
  {
    this.allUnits = [];
    this.orderedUnits = [];
  }

  public addUnit(unit: Unit): void
  {
    if (this.hasUnit(unit))
    {
      throw new Error(`Unit ${unit.name} is already part of turn order.`);
    }

    this.allUnits.push(unit);
    this.orderedUnits.push(unit);
  }
  public update(): void
  {
    this.orderedUnits = this.allUnits.filter(BattleTurnOrder.turnOrderFilterFN);

    this.orderedUnits.sort(BattleTurnOrder.turnOrderSortFN);
  }
  public getActiveUnit(): Unit
  {
    return this.orderedUnits[0];
  }
  public getDisplayData(): TurnOrderDisplayData[]
  {
    return this.orderedUnits.map(BattleTurnOrder.getDisplayDataFromUnit);
  }
  public getGhostIndex(ghostMoveDelay: number, ghostId: number): number
  {
    for (let i = 0; i < this.orderedUnits.length; i++)
    {
      const unit = this.orderedUnits[i];
      const unitMoveDelay = unit.battleStats.moveDelay;

      if (ghostMoveDelay < unitMoveDelay)
      {
        return i;
      }
      else if (ghostMoveDelay === unitMoveDelay && ghostId < unit.id)
      {
        return i;
      }
    }

    return this.orderedUnits.length;
  }

  private hasUnit(unit: Unit): boolean
  {
    return this.allUnits.indexOf(unit) !== -1;
  }
  private static turnOrderFilterFN(unit: Unit)
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
  private static turnOrderSortFN(a: Unit, b: Unit)
  {
    if (a.battleStats.moveDelay !== b.battleStats.moveDelay)
    {
      return a.battleStats.moveDelay - b.battleStats.moveDelay;
    }
    else
    {
      return a.id - b.id;
    }
  }
  private static getDisplayDataFromUnit(unit: Unit): TurnOrderDisplayData
  {
    return(
    {
      moveDelay: unit.battleStats.moveDelay,

      unit: unit,
      displayName: unit.name,
    });
  }
}
