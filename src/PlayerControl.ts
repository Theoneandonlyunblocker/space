import {Fleet} from "./Fleet";
import FleetAttackTarget from "./FleetAttackTarget";
import Player from "./Player";
import RectangleSelect from "./RectangleSelect";
import Star from "./Star";
import eventManager from "./eventManager";


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
    for (const name in this.listeners)
    {
      this.removeEventListener(name);
    }
  }
  addEventListener(name: string, handler: (...args: any[]) => void): void
  {
    this.listeners[name] = handler;

    eventManager.addEventListener(name, handler);
  }
  addEventListeners(): void
  {
    this.addEventListener("updateSelection", () =>
    {
      this.updateSelection();
    });

    this.addEventListener("selectFleets", (fleets: Fleet[]) =>
    {
      this.selectFleets(fleets);
    });
    this.addEventListener("deselectFleet", (fleet: Fleet) =>
    {
      this.deselectFleet(fleet);
    });
    this.addEventListener("mergeFleets", () =>
    {
      this.mergeFleets();
    });

    this.addEventListener("splitFleet", (fleet: Fleet) =>
    {
      this.splitFleet(fleet);
    });
    this.addEventListener("startReorganizingFleets", (fleets: Fleet[]) =>
    {
      this.startReorganizingFleets(fleets);
    });
    this.addEventListener("endReorganizingFleets", () =>
    {
      this.endReorganizingFleets();
    });

    this.addEventListener("starClick", (star: Star) =>
    {
      this.selectStar(star);
    });
    this.addEventListener("moveFleets", (star: Star) =>
    {
      this.moveFleets(star);
    });

    this.addEventListener("setRectangleSelectTargetFN", (rectangleSelect: RectangleSelect) =>
    {
      rectangleSelect.getSelectionTargetsFN =
        this.player.getFleetsWithPositions.bind(this.player);
    });

    this.addEventListener("attackTarget", (target: FleetAttackTarget) =>
    {
      this.attackTarget(target);
    });
  }
  preventGhost(delay: number): void
  {
    this.preventingGhost = true;
    const timeout = window.setTimeout(() =>
    {
      this.preventingGhost = false;
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
    if (endReorganizingFleets) { this.endReorganizingFleets(); }
    this.currentAttackTargets = this.getCurrentAttackTargets();

    eventManager.dispatchEvent("playerControlUpdated", null);
    eventManager.dispatchEvent("clearPossibleActions", null);
  }

  areAllFleetsInSameLocation(): boolean
  {
    if (this.selectedFleets.length <= 0) { return false; }

    for (let i = 1; i < this.selectedFleets.length; i++)
    {
      if (this.selectedFleets[i].location !== this.selectedFleets[i - 1].location)
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

    const playerFleets: Fleet[] = [];
    const otherFleets: Fleet[] = [];
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
        if (this.currentlyReorganizing.indexOf(fleets[i]) >= 0) { continue; }
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
    const fleetsContainer = this.selectedFleets.length > 0 ? this.selectedFleets : this.inspectedFleets;
    const fleetIndex = fleetsContainer.indexOf(fleet);

    if (fleetIndex < 0) { return; }

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
    if (fleets.length === 0) { return []; }

    const master = this.getMasterFleetForMerge(fleets);

    fleets.splice(fleets.indexOf(master), 1);
    const slaves = fleets;

    for (let i = 0; i < slaves.length; i++)
    {
      slaves[i].mergeWith(master, i === slaves.length - 1);
    }

    return [master];
  }
  mergeFleets(): void
  {
    const allFleets = this.selectedFleets;
    const normalFleets: Fleet[] = [];
    const stealthyFleets: Fleet[] = [];

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
    if (this.preventingGhost || this.selectedStar === star) { return; }
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
    if (fleet.units.length <= 0) { return; }
    this.endReorganizingFleets();
    const newFleet = fleet.split();

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
      const fleet = this.currentlyReorganizing[i];
      if (fleet.units.length <= 0)
      {
        const selectedIndex = this.selectedFleets.indexOf(fleet);
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
    if (this.selectedFleets.length < 1) { return []; }
    if (!this.areAllFleetsInSameLocation()) { return []; }

    const location = this.selectedFleets[0].location;
    const possibleTargets = location.getTargetsForPlayer(this.player);

    return possibleTargets;
  }

  attackTarget(target: FleetAttackTarget): void
  {
    if (this.currentAttackTargets.indexOf(target) < 0)
    {
      throw new Error("Invalid attack target");
    }

    const currentLocation = this.selectedFleets[0].location;

    this.player.attackTarget(currentLocation, target);
  }
}
