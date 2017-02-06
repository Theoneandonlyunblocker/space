import Player from "./Player";
import {Fleet} from "./Fleet";
import eventManager from "./eventManager";
import Star from "./Star";
import FleetAttackTarget from "./FleetAttackTarget";
import RectangleSelect from "./RectangleSelect";

export default class PlayerControl
{
  player: Player;

  selectedFleets: Fleet[] = [];
  inspectedFleets: Fleet[] = [];
  currentlyReorganizing: Fleet[] = [];
  lastSelectedFleetsIds:
  {
    [fleetId: number]: boolean;
  } = {};

  currentAttackTargets: FleetAttackTarget[];

  selectedStar: Star;

  preventingGhost: boolean = false;
  listeners:
  {
    [listenerName: string]: any;
  } = {};

  constructor(player: Player)
  {
    this.player = player;
    this.addEventListeners();
  }
  destroy(): void
  {
    this.removeEventListeners();

    this.player = null;
    this.selectedFleets = null;
    this.currentlyReorganizing = null;
    this.currentAttackTargets = null;
    this.selectedStar = null;
  }
  removeEventListener(name: string): void
  {
    eventManager.removeEventListener(name, this.listeners[name]);
  }
  removeEventListeners(): void
  {
    for (let name in this.listeners)
    {
      this.removeEventListener(name);
    }
  }
  addEventListener(name: string, handler: Function): void
  {
    this.listeners[name] = handler;

    eventManager.addEventListener(name, handler);
  }
  addEventListeners(): void
  {
    var self = this;

    this.addEventListener("updateSelection", function()
    {
      self.updateSelection();
    });

    this.addEventListener("selectFleets", function(fleets: Fleet[])
    {
      self.selectFleets(fleets);
    });
    this.addEventListener("deselectFleet", function(fleet: Fleet)
    {
      self.deselectFleet(fleet);
    });
    this.addEventListener("mergeFleets", function()
    {
      self.mergeFleets();
    });

    this.addEventListener("splitFleet", function(fleet: Fleet)
    {
      self.splitFleet(fleet);
    });
    this.addEventListener("startReorganizingFleets", function(fleets: Fleet[])
    {
      self.startReorganizingFleets(fleets);
    });
    this.addEventListener("endReorganizingFleets", function()
    {
      self.endReorganizingFleets();
    });

    this.addEventListener("starClick", function(star: Star)
    {
      self.selectStar(star);
    });
    this.addEventListener("moveFleets", function(star: Star)
    {
      self.moveFleets(star);
    });

    this.addEventListener("setRectangleSelectTargetFN", function(rectangleSelect: RectangleSelect)
    {
      rectangleSelect.getSelectionTargetsFN =
        self.player.getFleetsWithPositions.bind(self.player);
    });

    this.addEventListener("attackTarget", function(target: FleetAttackTarget)
    {
      self.attackTarget(target);
    });
  }
  preventGhost(delay: number): void
  {
    this.preventingGhost = true;
    var self = this;
    var timeout = window.setTimeout(function()
    {
      self.preventingGhost = false;
      window.clearTimeout(timeout);
    }, delay);
  }
  clearSelection(): void
  {
    this.selectedFleets = [];
    this.inspectedFleets = [];
    this.selectedStar = null;
  }
  updateSelection(endReorganizingFleets: boolean = true): void
  {
    if (endReorganizingFleets) this.endReorganizingFleets();
    this.currentAttackTargets = this.getCurrentAttackTargets();

    eventManager.dispatchEvent("playerControlUpdated", null);
    eventManager.dispatchEvent("clearPossibleActions", null);
  }

  areAllFleetsInSameLocation(): boolean
  {
    if (this.selectedFleets.length <= 0) return false;

    for (let i = 1; i < this.selectedFleets.length; i++)
    {
      if (this.selectedFleets[i].location !== this.selectedFleets[i-1].location)
      {
        return false;
      }
    }

    return true;
  }
  selectFleets(fleets: Fleet[]): void
  {
    if (fleets.length < 1)
    {
      this.clearSelection();
      this.updateSelection();
      return;
    }

    var playerFleets: Fleet[] = [];
    var otherFleets: Fleet[] = [];
    for (let i = 0; i < fleets.length; i++)
    {
      if (fleets[i].player === this.player)
      {
        playerFleets.push(fleets[i]);
      }
      else
      {
        otherFleets.push(fleets[i]);
      }
    }

    if (playerFleets.length > 0)
    {
      this.selectPlayerFleets(playerFleets);
    }
    else
    {
      this.selectOtherFleets(otherFleets);
    }

    this.updateSelection();
    this.preventGhost(15);
  }
  selectPlayerFleets(fleets: Fleet[]): void
  {
    this.clearSelection();

    for (let i = 0; i < fleets.length; i++)
    {
      if (fleets[i].units.length < 1)
      {
        if (this.currentlyReorganizing.indexOf(fleets[i]) >= 0) continue;
        fleets[i].deleteFleet();
        fleets.splice(i, 1);
      }
    }

    this.selectedFleets = fleets;
  }
  selectOtherFleets(fleets: Fleet[]): void
  {
    this.inspectedFleets = fleets;
  }
  deselectFleet(fleet: Fleet): void
  {
    var fleetsContainer = this.selectedFleets.length > 0 ? this.selectedFleets : this.inspectedFleets;
    var fleetIndex = fleetsContainer.indexOf(fleet);

    if (fleetIndex < 0) return;

    fleetsContainer.splice(fleetIndex, 1);

    if (fleetsContainer.length < 1)
    {
      this.selectedStar = fleet.location;
    }

    this.updateSelection();
  }
  getMasterFleetForMerge(fleets: Fleet[]): Fleet
  {
    return fleets[0];
  }
  mergeFleetsOfSameType(fleets: Fleet[]): Fleet[]
  {
    if (fleets.length === 0) return [];

    var master = this.getMasterFleetForMerge(fleets);

    fleets.splice(fleets.indexOf(master), 1);
    var slaves = fleets;

    for (let i = 0; i < slaves.length; i++)
    {
      slaves[i].mergeWith(master, i === slaves.length - 1);
    }

    return [master];
  }
  mergeFleets(): void
  {
    var allFleets = this.selectedFleets;
    var normalFleets: Fleet[] = [];
    var stealthyFleets: Fleet[] = [];

    for (let i = 0; i < allFleets.length; i++)
    {
      if (allFleets[i].isStealthy)
      {
        stealthyFleets.push(allFleets[i]);
      }
      else
      {
        normalFleets.push(allFleets[i]);
      }
    }

    this.clearSelection();
    this.selectedFleets =
      this.mergeFleetsOfSameType(normalFleets).concat(this.mergeFleetsOfSameType(stealthyFleets));
    this.updateSelection();
  }
  selectStar(star: Star): void
  {
    if (this.preventingGhost || this.selectedStar === star) return;
    this.clearSelection();

    this.selectedStar = star;

    this.updateSelection();
  }
  moveFleets(star: Star): void
  {
    for (let i = 0; i < this.selectedFleets.length; i++)
    {
      this.selectedFleets[i].pathFind(star);
    }
  }
  splitFleet(fleet: Fleet): void
  {
    if (fleet.units.length <= 0) return;
    this.endReorganizingFleets();
    var newFleet = fleet.split();

    this.currentlyReorganizing = [fleet, newFleet];
    this.selectedFleets = [fleet, newFleet];

    this.updateSelection(false);
  }
  startReorganizingFleets(fleets: Fleet[]): void
  {
    if (
      fleets.length !== 2 ||
      fleets[0].location !== fleets[1].location ||
      this.selectedFleets.length !== 2 ||
      this.selectedFleets.indexOf(fleets[0]) < 0 ||
      this.selectedFleets.indexOf(fleets[1]) < 0
    )
    {
      throw new Error("cant reorganize fleets");
    }
    this.currentlyReorganizing = fleets;

    this.updateSelection(false);
  }
  endReorganizingFleets(): void
  {
    for (let i = 0; i < this.currentlyReorganizing.length; i++)
    {
      var fleet = this.currentlyReorganizing[i];
      if (fleet.units.length <= 0)
      {
        var selectedIndex = this.selectedFleets.indexOf(fleet);
        if (selectedIndex >= 0)
        {
          this.selectedFleets.splice(selectedIndex, 1);
        }
        fleet.deleteFleet();
      }
    }
    this.currentlyReorganizing = [];
  }
  getCurrentAttackTargets(): FleetAttackTarget[]
  {
    if (this.selectedFleets.length < 1) return [];
    if (!this.areAllFleetsInSameLocation()) return [];

    var location = this.selectedFleets[0].location;
    var possibleTargets = location.getTargetsForPlayer(this.player);

    return possibleTargets;
  }

  attackTarget(target: FleetAttackTarget): void
  {
    if (this.currentAttackTargets.indexOf(target) < 0)
    {
      throw new Error("Invalid attack target")
    }

    var currentLocation = this.selectedFleets[0].location;

    this.player.attackTarget(currentLocation, target);
  }
}
