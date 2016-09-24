import app from "./App"; // TODO global

import idGenerators from "./idGenerators";
import Star from "./Star";
import Unit from "./Unit";
import Name from "./Name";
import Player from "./Player";
import FleetSaveData from "./savedata/FleetSaveData";
import eventManager from "./eventManager";
import
{
  aStar,
  backTrace
} from "./pathFinding";


export default class Fleet
{
  player: Player;
  units: Unit[] = [];
  location: Star;

  visionIsDirty: boolean = true;
  visibleStars: Star[] = [];
  detectedStars: Star[] = [];
  isStealthy: boolean;

  id: number;
  name: Name;

  constructor(player: Player, units: Unit[], location: Star,
    id?: number, shouldRender: boolean = true)
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
  getUnitIndex(unit: Unit): number
  {
    return this.units.indexOf(unit);
  }
  hasUnit(unit: Unit): boolean
  {
    return this.getUnitIndex(unit) >= 0;
  }
  deleteFleet(shouldRender: boolean = true): void
  {
    this.location.removeFleet(this);
    this.player.removeFleet(this);

    if (shouldRender)
    {
      eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    }
  }
  mergeWith(fleet: Fleet, shouldRender: boolean = true): void
  {
    if (fleet.isStealthy !== this.isStealthy)
    {
      throw new Error("Tried to merge stealthy fleet with non stealthy or other way around");
    }

    fleet.addUnits(this.units);
    this.deleteFleet(shouldRender);
  }
  addUnit(unit: Unit): void
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
    unit.addToFleet(this);

    this.visionIsDirty = true;
  }
  addUnits(units: Unit[]): void
  {
    for (let i = 0; i < units.length; i++)
    {
      this.addUnit(units[i]);
    }
  }
  removeUnit(unit: Unit): void
  {
    var index = this.getUnitIndex(unit);

    if (index < 0) return false;

    this.units.splice(index, 1);
    unit.removeFromFleet();

    this.visionIsDirty = true;

    if (this.units.length <= 0)
    {
      this.deleteFleet();
    }
  }
  removeUnits(units: Unit[]): void
  {
    for (let i = 0; i < units.length; i++)
    {
      this.removeUnit(units[i]);
    }
  }
  transferUnit(fleet: Fleet, unit: Unit): void
  {
    if (fleet === this)
    {
      return;
    }
    if (unit.isStealthy() !== this.isStealthy)
    {
      throw new Error("Tried to transfer stealthy unit to non stealthy fleet");
    }
    var index = this.getUnitIndex(unit);

    if (index < 0)
    {
      return false;
    }

    fleet.addUnit(unit);

    this.units.splice(index, 1);
    eventManager.dispatchEvent("renderLayer", "fleets", this.location);
  }
  split(): Fleet
  {
    var newFleet = new Fleet(this.player, [], this.location);
    this.location.addFleet(newFleet);


    return newFleet;
  }
  splitStealthyUnits(): Fleet
  {
    var stealthyUnits = this.units.filter(function(unit: Unit)
    {
      return unit.isStealthy();
    });

    var newFleet = new Fleet(this.player, stealthyUnits, this.location);
    this.location.addFleet(newFleet);
    this.removeUnits(stealthyUnits);

    return newFleet;
  }
  getMinCurrentMovePoints(): number
  {
    if (!this.units[0]) return 0;

    var min = this.units[0].currentMovePoints;

    for (let i = 0; i < this.units.length; i++)
    {
      min = Math.min(this.units[i].currentMovePoints, min);
    }
    return min;
  }
  getMinMaxMovePoints(): number
  {
    if (!this.units[0]) return 0;

    var min = this.units[0].maxMovePoints;

    for (let i = 0; i < this.units.length; i++)
    {
      min = Math.min(this.units[i].maxMovePoints, min);
    }
    return min;
  }
  canMove(): boolean
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
  // TODO 24.9.2016 | add amount parameter
  subtractMovePoints(): void
  {
    for (let i = 0; i < this.units.length; i++)
    {
      this.units[i].currentMovePoints--;
    }
  }
  move(newLocation: Star): void
  {
    if (newLocation === this.location) return;
    if (!this.canMove()) return;
    
    var oldLocation = this.location;
    oldLocation.removeFleet(this);

    this.location = newLocation;
    newLocation.addFleet(this);

    this.subtractMovePoints();

    this.visionIsDirty = true;
    this.player.visionIsDirty = true;

    // maybe send an event instead?
    for (let i = 0; i < app.game.playerOrder.length; i++)
    {
      var player = app.game.playerOrder[i];
      if (player.isIndependent || player === this.player)
      {
        continue;
      }

      player.updateAllVisibilityInStar(newLocation);
    }

    eventManager.dispatchEvent("renderLayer", "fleets", this.location);
    eventManager.dispatchEvent("updateSelection", null);
  }
  getPathTo(newLocation: Star)
  {
    var a = aStar(this.location, newLocation);

    if (!a) return;

    var path = backTrace(a.came, newLocation);

    return path;
  }
  pathFind(newLocation: Star, onMove?: () => void, afterMove?: () => void): void
  {
    var path = this.getPathTo(newLocation);

    var interval = window.setInterval(function()
    {
      if (!path || path.length <= 0)
      {
        window.clearInterval(interval);
        if (afterMove) afterMove();
        return;

      }

      var move = path.shift();
      this.move(move.star);
      if (onMove) onMove();

    }.bind(this), 10);
  }
  getFriendlyFleetsAtOwnLocation(): Fleet[]
  {
    return this.location.fleets[this.player.id];
  }
  // TODO 24.9.2016 | split function
  getTotalHealth()
  {
    var total =
    {
      current: 0,
      max: 0
    }

    for (let i = 0; i < this.units.length; i++)
    {
      total.current += this.units[i].currentHealth;
      total.max += this.units[i].maxHealth;
    }

    return total;
  }
  updateVisibleStars(): void
  {
    var highestVisionRange = 0;
    var highestDetectionRange = -1;

    for (let i = 0; i < this.units.length; i++)
    {
      highestVisionRange = Math.max(this.units[i].getVisionRange(), highestVisionRange);
      highestDetectionRange = Math.max(this.units[i].getDetectionRange(), highestDetectionRange);
    }

    var inVision = this.location.getLinkedInRange(highestVisionRange);
    var inDetection = this.location.getLinkedInRange(highestDetectionRange);

    this.visibleStars = inVision.all;
    this.detectedStars = inDetection.all;

    this.visionIsDirty = false;
  }
  getVision(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return this.visibleStars;
  }
  getDetection(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return this.detectedStars;
  }
  serialize(): FleetSaveData
  {
    var data: FleetSaveData =
    {
      id: this.id,
      name: this.name.serialize(),

      locationId: this.location.id,
      playerId: this.player.id,
      units: this.units.map(function(unit: Unit)
      {
        return unit.serialize(false);
      })
    };

    return data;
  }
}
