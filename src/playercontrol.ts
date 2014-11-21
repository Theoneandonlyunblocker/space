/// <reference path="eventmanager.ts"/>
/// <reference path="player.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="star.ts"/>

module Rance
{
  export class PlayerControl
  {
    player: Player;

    selectedFleets: Fleet[] = [];
    currentlyReorganizing: Fleet[] = [];

    currentAttackTargets: any[];

    selectedStar: Star;

    preventingGhost: boolean = false;

    constructor(player: Player)
    {
      this.player = player;
      this.addEventListeners();
    }
    addEventListeners()
    {
      var self = this;

      eventManager.addEventListener("selectFleets", function(e)
      {
        self.selectFleets(e.data);
      });
      eventManager.addEventListener("deselectFleet", function(e)
      {
        self.deselectFleet(e.data);
      });
      eventManager.addEventListener("mergeFleets", function(e)
      {
        self.mergeFleets();
      });

      eventManager.addEventListener("splitFleet", function(e)
      {
        self.splitFleet(e.data);
      });
      eventManager.addEventListener("startReorganizingFleets", function(e)
      {
        self.startReorganizingFleets(e.data);
      });
      eventManager.addEventListener("endReorganizingFleets", function(e)
      {
        self.endReorganizingFleets();
      });

      eventManager.addEventListener("starClick", function(e)
      {
        self.selectStar(e.data);
      });
      eventManager.addEventListener("starRightClick", function(e)
      {
        self.moveFleets(e.data);
      });
      
      eventManager.addEventListener("setRectangleSelectTargetFN", function(e)
      {
        e.data.getSelectionTargetsFN = self.player.getFleetsWithPositions.bind(self.player);
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
      this.selectedStar = null;
    }
    updateSelection(endReorganizingFleets: boolean = true)
    {
      if (endReorganizingFleets) this.endReorganizingFleets();
      this.currentAttackTargets = this.getCurrentAttackTargets();
      eventManager.dispatchEvent("updateSelection", null);
    }
    areAllFleetsInSameLocation()
    {
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

      this.selectedFleets = fleets;

      this.updateSelection();
      if (fleets.length > 0)
      {
        this.preventGhost(15);
      }
    }
    deselectFleet(fleet: Fleet)
    {
      var fleetIndex = this.selectedFleets.indexOf(fleet);

      if (fleetIndex < 0) return;

      this.selectedFleets.splice(fleetIndex, 1);

      this.updateSelection();
    }
    getMasterFleetForMerge()
    {
      return this.selectedFleets[0];
    }
    mergeFleets()
    {
      var fleets = this.selectedFleets;
      var master = this.getMasterFleetForMerge();

      fleets.splice(fleets.indexOf(master), 1);
      var slaves = fleets;

      for (var i = 0; i < slaves.length; i++)
      {
        slaves[i].mergeWith(master);
      }

      this.clearSelection();
      this.selectedFleets = [master];
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
        this.selectedFleets[i].pathFind(star, this.updateSelection.bind(this));
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
      if (!this.areAllFleetsInSameLocation) return [];

      var location = this.selectedFleets[0].location;
      var possibleTargets = location.getTargetsForPlayer(this.player);

      return possibleTargets;
    }
  }
}
