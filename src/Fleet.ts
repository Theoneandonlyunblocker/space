import app from "./App"; // TODO global

import eventManager from "./eventManager";
import idGenerators from "./idGenerators";
import Name from "./Name";
import Player from "./Player";
import Star from "./Star";
import Unit from "./Unit";

import
{
  aStar,
  backTrace,
  PathNode,
} from "./pathFinding";

import FleetSaveData from "./savedata/FleetSaveData";

export class Fleet
{
  public id: number;
  public name: Name;

  public player: Player;
  public units: Unit[] = [];
  public location: Star;

  public isStealthy: boolean;

  private visionIsDirty: boolean = true;
  private visibleStars: Star[] = [];
  private detectedStars: Star[] = [];


  // TODO 28.10.2016 | don't add fleet to location or player in constructor
  constructor(
    player: Player,
    units: Unit[],
    location: Star,
    id?: number,
    shouldRender: boolean = true
  )
  {
    this.player = player;
    this.location = location;
    this.id = isFinite(id) ? id : idGenerators.fleet++;
    this.name = new Name("Fleet " + this.id);

    this.location.addFleet(this);
    this.player.addFleet(this);

    this.addUnits(units);

    if (shouldRender)
    {
      eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    }
  }

  public static sortByImportance(a: Fleet, b: Fleet): number
  {
    // TODO 26.10.2016 | should keep track of fleets with custom names
    const unitCountSort = b.units.length - a.units.length;
    if (unitCountSort)
    {
      return unitCountSort;
    }
    else
    {
      return a.id - b.id;
    }
  }

  public deleteFleet(shouldRender: boolean = true): void
  {
    this.location.removeFleet(this);
    this.player.removeFleet(this);

    if (shouldRender)
    {
      eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    }
  }
  public mergeWith(fleet: Fleet, shouldRender: boolean = true): void
  {
    if (fleet.isStealthy !== this.isStealthy)
    {
      throw new Error("Tried to merge stealthy fleet with non stealthy or other way around");
    }

    fleet.addUnits(this.units);
    this.deleteFleet(shouldRender);
  }
  public addUnits(units: Unit[]): void
  {
    for (let i = 0; i < units.length; i++)
    {
      this.addUnit(units[i]);
    }
  }
  public removeUnit(unit: Unit): void
  {
    const index = this.getUnitIndex(unit);

    if (index < 0)
    {
      throw this.makeNoUnitError(unit);
    }

    this.units.splice(index, 1);
    unit.fleet = null;

    this.visionIsDirty = true;

    if (this.units.length <= 0)
    {
      this.deleteFleet();
    }
  }
  public transferUnit(fleet: Fleet, unit: Unit, shouldRender: boolean = true): void
  {
    if (fleet === this)
    {
      throw new Error("Tried to transfer unit into unit's current fleet");
    }
    if (unit.isStealthy() !== this.isStealthy)
    {
      throw new Error("Tried to transfer stealthy unit to non stealthy fleet");
    }
    const index = this.getUnitIndex(unit);

    if (index < 0)
    {
      throw this.makeNoUnitError(unit);
    }

    fleet.addUnit(unit);

    this.units.splice(index, 1);
    eventManager.dispatchEvent("renderLayer", "fleets", this.location);
  }
  public split(): Fleet
  {
    const newFleet = new Fleet(this.player, [], this.location);

    return newFleet;
  }
  public getMinCurrentMovePoints(): number
  {
    if (!this.units[0])
    {
      return 0;
    }

    let min = this.units[0].currentMovePoints;

    for (let i = 0; i < this.units.length; i++)
    {
      min = Math.min(this.units[i].currentMovePoints, min);
    }
    return min;
  }
  public getMinMaxMovePoints(): number
  {
    if (!this.units[0])
    {
      return 0;
    }

    let min = this.units[0].maxMovePoints;

    for (let i = 0; i < this.units.length; i++)
    {
      min = Math.min(this.units[i].maxMovePoints, min);
    }
    return min;
  }
  public getPathTo(newLocation: Star): PathNode[]
  {
    const a = aStar(this.location, newLocation);

    if (!a)
    {
      throw new Error(`Couldn't find path between ${this.location.name} and ${newLocation.name}`);
    }

    const path = backTrace(a.came, newLocation);

    return path;
  }
  public pathFind(newLocation: Star, onMove?: () => void, afterMove?: () => void): void
  {
    const path = this.getPathTo(newLocation);

    const interval = window.setInterval(() =>
    {
      if (!path || path.length <= 0)
      {
        window.clearInterval(interval);
        if (afterMove)
        {
          afterMove();
        }
        return;

      }

      const move = path.shift();
      this.move(move.star);
      if (onMove)
      {
        onMove();
      }

    }, 10);
  }
  public getTotalCurrentHealth(): number
  {
    let total = 0;

    this.units.forEach((unit) =>
    {
      total += unit.currentHealth;
    });

    return total;
  }
  public getTotalMaxHealth(): number
  {
    let total = 0;

    this.units.forEach((unit) =>
    {
      total += unit.maxHealth;
    });

    return total;
  }
  public getVision(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return this.visibleStars;
  }
  public getDetection(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return this.detectedStars;
  }
  public serialize(): FleetSaveData
  {
    const data: FleetSaveData =
    {
      id: this.id,
      name: this.name.serialize(),

      locationId: this.location.id,
      playerId: this.player.id,
      unitIds: this.units.map((unit) => unit.id),
    };

    return data;
  }

  private addUnit(unit: Unit): void
  {
    if (this.hasUnit(unit))
    {
      throw new Error("Tried to add unit to fleet which the unit was already part of");
    }

    if (this.units.length === 0)
    {
      this.isStealthy = unit.isStealthy();
    }
    else if (unit.isStealthy() !== this.isStealthy)
    {
      throw new Error("Tried to add stealthy unit to non stealthy fleet or other way around");
    }

    this.units.push(unit);
    unit.fleet = this;

    this.visionIsDirty = true;
  }
  private canMove(): boolean
  {
    for (let i = 0; i < this.units.length; i++)
    {
      if (this.units[i].currentMovePoints <= 0)
      {
        return false;
      }
    }

    if (this.getMinCurrentMovePoints() > 0)
    {
      return true;
    }

    return false;
  }
  private subtractMovePoints(amount: number): void
  {
    for (let i = 0; i < this.units.length; i++)
    {
      this.units[i].currentMovePoints -= amount;
    }
  }
  private move(newLocation: Star): void
  {
    if (newLocation === this.location)
    {
      return;
    }
    if (!this.canMove())
    {
      return;
    }

    const oldLocation = this.location;
    oldLocation.removeFleet(this);

    this.location = newLocation;
    newLocation.addFleet(this);

    this.subtractMovePoints(1);

    this.visionIsDirty = true;
    this.player.visionIsDirty = true;

    // maybe send an event instead?
    for (let i = 0; i < app.game.playerOrder.length; i++)
    {
      const player = app.game.playerOrder[i];
      if (player.isIndependent || player === this.player)
      {
        continue;
      }

      player.updateAllVisibilityInStar(newLocation);
    }

    eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    eventManager.dispatchEvent("updateSelection", null);
  }
  private updateVisibleStars(): void
  {
    let highestVisionRange = 0;
    let highestDetectionRange = -1;

    for (let i = 0; i < this.units.length; i++)
    {
      highestVisionRange = Math.max(this.units[i].getVisionRange(), highestVisionRange);
      highestDetectionRange = Math.max(this.units[i].getDetectionRange(), highestDetectionRange);
    }

    const inVision = this.location.getLinkedInRange(highestVisionRange);
    const inDetection = this.location.getLinkedInRange(highestDetectionRange);

    this.visibleStars = inVision.all;
    this.detectedStars = inDetection.all;

    this.visionIsDirty = false;
  }
  private makeNoUnitError(unit: Unit): Error
  {
    return new Error(`Unit ${unit.name} is not part of fleet ${this.name}`);
  }
  private getUnitIndex(unit: Unit): number
  {
    return this.units.indexOf(unit);
  }
  private hasUnit(unit: Unit): boolean
  {
    return this.getUnitIndex(unit) >= 0;
  }
}
