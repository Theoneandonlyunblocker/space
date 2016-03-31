namespace Rance
{
  export interface ITurnOrderDisplayData
  {
    moveDelay: number;

    isGhost: boolean;
    unit: Unit;
    displayName: string;
  }
  export class BattleTurnOrder
  {
    private allUnits: Unit[] = [];
    private orderedUnits: Unit[] = [];

    constructor()
    {

    }
    public destroy(): void
    {
      this.allUnits = null;
      this.orderedUnits = null;
    }

    private hasUnit(unit: Unit): boolean
    {
      return this.allUnits.indexOf(unit) !== -1;
    }
    public addUnit(unit: Unit): void
    {
      if (this.hasUnit(unit))
      {
        throw new Error("Unit " + unit.name + " is already part of turn order");
      }

      this.allUnits.push(unit);
      this.orderedUnits.push(unit);
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
    public update(): void
    {
      this.orderedUnits = this.allUnits.filter(BattleTurnOrder.turnOrderFilterFN);

      this.orderedUnits.sort(BattleTurnOrder.turnOrderSortFN);
    }
    public getActiveUnit(): Unit
    {
      return this.orderedUnits[0];
    }
    private static getDisplayDataFromUnit(unit: Unit): ITurnOrderDisplayData
    {
      return(
      {
        moveDelay: unit.battleStats.moveDelay,

        isGhost: false,
        unit: unit,
        displayName: unit.name
      });
    }
    private static makeGhostDisplayData(ghostMoveDelay: number): ITurnOrderDisplayData
    {
      return(
      {
        moveDelay: ghostMoveDelay,

        isGhost: true,
        unit: null,
        displayName: null
      });
    }
    private getGhostIndex(ghostMoveDelay: number, ghostId: number): number
    {
      for (var i = 0; i < this.orderedUnits.length; i++)
      {
        var unit = this.orderedUnits[i];
        var unitMoveDelay = unit.battleStats.moveDelay;
        
        if (ghostMoveDelay < unitMoveDelay)
        {
          return i;
        }
        else if (ghostMoveDelay === unitMoveDelay && ghostId < unit.id)
        {
          return i;
        }
      }

      return i;
    }
    public getDisplayData(ghostMoveDelay?: number, ghostId?: number): ITurnOrderDisplayData[]
    {
      var displayData = this.orderedUnits.map(BattleTurnOrder.getDisplayDataFromUnit);

      if (isFinite(ghostMoveDelay))
      {
        var ghostIndex = this.getGhostIndex(ghostMoveDelay, ghostId);
        var ghostDisplayData = BattleTurnOrder.makeGhostDisplayData(ghostMoveDelay);
        displayData.splice(ghostIndex, 0, ghostDisplayData);
      }

      return displayData;
    }
  }
}
