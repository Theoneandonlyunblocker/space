import {app} from "../app/App"; // TODO global

import {Name} from "../localization/Name";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {Unit} from "../unit/Unit";
import {eventManager} from "../app/eventManager";
import {idGenerators} from "../app/idGenerators";

import
{
  aStar,
  backTrace,
  PathNode,
} from "../map/pathFinding";

import {FleetSaveData} from "../savedata/FleetSaveData";


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


  private constructor(units: Unit[], player: Player, id?: number)
  {
    this.id = isFinite(id) ? id : idGenerators.fleet++;
    this.player = player;

    units.forEach(unitToAdd =>
    {
      this.addUnit(unitToAdd);
    });

    this.name = player.race.getFleetName(this);
    eventManager.dispatchEvent("renderLayer", "fleets", this.location);
  }

  public static createFleetsFromUnits(units: Unit[], player: Player): Fleet[]
  {
    const stealthyUnits = units.filter(unit => unit.isStealthy());
    const nonStealthyUnits = units.filter(unit => !unit.isStealthy());

    const fleets = [stealthyUnits, nonStealthyUnits].filter(unitsInGroup =>
    {
      return unitsInGroup.length > 0;
    }).map(unitsInGroup =>
    {
      return new Fleet(unitsInGroup, player);
    });

    return fleets;
  }
  /**
   * only use if you know units don't have stealthy and non-stealthy units mixed
   */
  public static createFleet(units: Unit[], player: Player, id?: number): Fleet
  {
    return new Fleet(units, player, id);
  }

  public static sortByImportance(a: Fleet, b: Fleet): number
  {
    const customNameSort = Number(b.name.hasBeenCustomized) - Number(a.name.hasBeenCustomized);
    if (customNameSort)
    {
      return customNameSort;
    }

    const unitCountSort = b.units.length - a.units.length;
    if (unitCountSort)
    {
      return unitCountSort;
    }

    return a.id - b.id;
  }
  private static makeAlreadyInFleetError(unit: Unit): Error
  {
    return new Error(`Unit ${unit.name} is already part of fleet ${unit.fleet.name.toString()}`);
  }
  private static makeNotInFleetError(unit: Unit, fleet: Fleet): Error
  {
    return new Error(`Unit ${unit.name} is not part of fleet ${fleet.name.toString()}`);
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
  public mergeWith(fleetToMergeWith: Fleet, shouldRender: boolean = true): void
  {
    if (fleetToMergeWith.isStealthy !== this.isStealthy)
    {
      throw new Error("Tried to merge stealthy fleet with non stealthy or other way around");
    }

    for (let i = this.units.length - 1; i >= 0; i--)
    {
      const unit = this.units[i];
      this.transferUnit(fleetToMergeWith, unit, shouldRender);
    }

    this.deleteFleet(shouldRender);
  }
  public addUnit(unit: Unit): void
  {
    if (unit.fleet)
    {
      throw Fleet.makeAlreadyInFleetError(unit);
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
  public removeUnit(unit: Unit): void
  {
    const index = this.units.indexOf(unit);

    if (index < 0)
    {
      throw Fleet.makeNotInFleetError(unit, this);
    }

    this.units.splice(index, 1);
    unit.fleet = null;

    this.visionIsDirty = true;
  }
  public transferUnit(receivingFleet: Fleet, unitToTransfer: Unit, shouldRender: boolean = true): void
  {
    if (receivingFleet === this)
    {
      throw new Error("Tried to transfer unit into unit's current fleet");
    }

    this.removeUnit(unitToTransfer);
    receivingFleet.addUnit(unitToTransfer);

    if (shouldRender)
    {
      eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    }
  }
  public split(): Fleet
  {
    const newFleet = new Fleet([], this.player);
    this.player.addFleet(newFleet);
    this.location.addFleet(newFleet);

    return newFleet;
  }
  public getMinCurrentMovePoints(): number
  {
    return this.units.map(unit =>
    {
      return unit.currentMovePoints;
    }).reduce((minMovePoints, currentUnitMovePoints) =>
    {
      return Math.min(minMovePoints, currentUnitMovePoints);
    }, Infinity);
  }
  public getMinMaxMovePoints(): number
  {
    return this.units.map(unit =>
    {
      return unit.maxMovePoints;
    }).reduce((minMovePoints, currentUnitMovePoints) =>
    {
      return Math.min(minMovePoints, currentUnitMovePoints);
    }, Infinity);
  }
  public hasEnoughMovePointsToMoveTo(target: Star): boolean
  {
    return this.getMinCurrentMovePoints() >= this.location.getDistanceToStar(target);
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
    return this.units.map(unit =>
    {
      return unit.currentHealth;
    }).reduce((total, current) =>
    {
      return total + current;
    }, 0);
  }
  public getTotalMaxHealth(): number
  {
    return this.units.map(unit =>
    {
      return unit.maxHealth;
    }).reduce((total, current) =>
    {
      return total + current;
    }, 0);
  }
  public getVisibleStars(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return this.visibleStars;
  }
  public getDetectedStars(): Star[]
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
      unitIds: this.units.map(unit => unit.id),
    };

    return data;
  }

  private canMove(): boolean
  {
    return this.units.every(unit => unit.currentMovePoints > 0);
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

    this.units.forEach(unit => unit.currentMovePoints -= 1);

    this.visionIsDirty = true;
    this.player.visionIsDirty = true;

    // maybe send an event instead?
    app.game.getLiveMajorPlayers().forEach(player =>
    {
      if (player !== this.player)
      {
        player.updateAllVisibilityInStar(oldLocation);
        player.updateAllVisibilityInStar(newLocation);
      }
    });

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
}
