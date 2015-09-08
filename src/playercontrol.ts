/// <reference path="eventmanager.ts"/>
/// <reference path="player.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="star.ts"/>
/// <reference path="battledata.ts"/>

module Rance
{
  export class PlayerControl
  {
    player: Player;

    selectedFleets: Fleet[] = [];
    inspectedFleets: Fleet[] = [];
    currentlyReorganizing: Fleet[] = [];

    currentAttackTargets: any[];

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
    destroy()
    {
      this.removeEventListeners();
      
      this.player = null;
      this.selectedFleets = null;
      this.currentlyReorganizing = null;
      this.currentAttackTargets = null;
      this.selectedStar = null;
    }
    removeEventListener(name: string)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }
    removeEventListeners()
    {
      for (var name in this.listeners)
      {
        this.removeEventListener(name);
      }
    }
    addEventListener(name: string, handler: Function)
    {
      this.listeners[name] = handler;

      eventManager.addEventListener(name, handler);
    }
    addEventListeners()
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

      this.addEventListener("attackTarget", function(target: any)
      {
        self.attackTarget(target);
      });
    }
    preventGhost(delay: number)
    {
      this.preventingGhost = true;
      var self = this;
      var timeout = window.setTimeout(function()
      {
        self.preventingGhost = false;
        window.clearTimeout(timeout);
      }, delay);
    }
    clearSelection()
    {
      this.selectedFleets = [];
      this.inspectedFleets = [];
      this.selectedStar = null;
    }
    updateSelection(endReorganizingFleets: boolean = true)
    {
      if (endReorganizingFleets) this.endReorganizingFleets();
      this.currentAttackTargets = this.getCurrentAttackTargets();

      eventManager.dispatchEvent("playerControlUpdated", null);
      eventManager.dispatchEvent("clearPossibleActions", null);
    }

    areAllFleetsInSameLocation()
    {
      if (this.selectedFleets.length <= 0) return false;
      
      for (var i = 1; i < this.selectedFleets.length; i++)
      {
        if (this.selectedFleets[i].location !== this.selectedFleets[i-1].location)
        {
          return false;
        }
      }

      return true;
    }
    selectFleets(fleets: Fleet[])
    {
      if (fleets.length < 1)
      {
        this.clearSelection();
        this.updateSelection();
        return;
      }
      
      var playerFleets: Fleet[] = [];
      var otherFleets: Fleet[] = [];
      for (var i = 0; i < fleets.length; i++)
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
    selectPlayerFleets(fleets: Fleet[])
    {
      this.clearSelection();

      for (var i = 0; i < fleets.length; i++)
      {
        if (fleets[i].ships.length < 1)
        {
          if (this.currentlyReorganizing.indexOf(fleets[i]) >= 0) continue;
          fleets[i].deleteFleet();
          fleets.splice(i, 1);
        }
      }

      var oldFleets = this.selectedFleets.slice(0);

      this.selectedFleets = fleets;
    }
    selectOtherFleets(fleets: Fleet[])
    {
      this.inspectedFleets = fleets;
    }
    deselectFleet(fleet: Fleet)
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
    getMasterFleetForMerge(fleets: Fleet[])
    {
      return fleets[0];
    }
    mergeFleetsOfSameType(fleets: Fleet[]): Fleet[]
    {
      if (fleets.length === 0) return [];
      
      var master = this.getMasterFleetForMerge(fleets);

      fleets.splice(fleets.indexOf(master), 1);
      var slaves = fleets;

      for (var i = 0; i < slaves.length; i++)
      {
        slaves[i].mergeWith(master, i === slaves.length - 1);
      }

      return [master];
    }
    mergeFleets()
    {
      var allFleets = this.selectedFleets;
      var normalFleets: Fleet[] = [];
      var stealthyFleets: Fleet[] = [];

      for (var i = 0; i < allFleets.length; i++)
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
    selectStar(star: Star)
    {
      if (this.preventingGhost) return;
      this.clearSelection();

      this.selectedStar = star;

      this.updateSelection();
    }
    moveFleets(star: Star)
    {
      for (var i = 0; i < this.selectedFleets.length; i++)
      {
        this.selectedFleets[i].pathFind(star);
      }
    }
    splitFleet(fleet: Fleet)
    {
      if (fleet.ships.length <= 0) return;
      this.endReorganizingFleets();
      var newFleet = fleet.split();

      this.currentlyReorganizing = [fleet, newFleet];
      this.selectedFleets = [fleet, newFleet];

      this.updateSelection(false);
    }
    startReorganizingFleets(fleets: Fleet[])
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
    endReorganizingFleets()
    {
      for (var i = 0; i < this.currentlyReorganizing.length; i++)
      {
        var fleet = this.currentlyReorganizing[i];
        if (fleet.ships.length <= 0)
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
    getCurrentAttackTargets()
    {
      if (this.selectedFleets.length < 1) return [];
      if (!this.areAllFleetsInSameLocation()) return [];

      var location = this.selectedFleets[0].location;
      var possibleTargets = location.getTargetsForPlayer(this.player);

      return possibleTargets;
    }

    attackTarget(target: any)
    {
      if (this.currentAttackTargets.indexOf(target) < 0) return false;

      var currentLocation = this.selectedFleets[0].location;

      this.player.attackTarget(currentLocation, target);
    }
  }
}
