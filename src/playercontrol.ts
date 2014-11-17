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
      eventManager.addEventListener("starClick", function(e)
      {
        self.selectStar(e.data);
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
    selectStar(star: Star)
    {
      this.clearSelection();

      this.selectedStar = star;

      this.updateSelection();
    }
  }
}
