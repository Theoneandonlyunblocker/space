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

    selectedStar: Star;

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
    clearSelection()
    {
      this.selectedFleets = [];
      this.selectedStar = null;
    }
    updateSelection()
    {
      eventManager.dispatchEvent("updateSelection", null);
    }
    selectFleets(fleets: Fleet[])
    {
      this.clearSelection();

      this.selectedFleets = fleets;

      this.updateSelection();
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
      this.clearSelection();

      this.selectedStar = star;

      this.updateSelection();
    }
    moveFleets(star: Star)
    {
      for (var i = 0; i < this.selectedFleets.length; i++)
      {
        this.selectedFleets[i].move(star);
      }
      this.updateSelection();

      eventManager.dispatchEvent("renderMap", null);
    }
  }
}
