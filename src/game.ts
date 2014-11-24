/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="eventmanager.ts"/>

module Rance
{
  export class Game
  {
    turnNumber: number;
    playerOrder: Player[];
    humanPlayer: Player;
    activePlayer: Player;

    playerControl: PlayerControl;

    constructor(players: Player[], humanPlayer: Player)
    {
      this.playerOrder = players;
      this.humanPlayer = humanPlayer;

      this.addEventListeners();
    }
    addEventListeners()
    {
      var self = this;

      eventManager.addEventListener("endTurn", function(e)
      {
        self.endTurn();
      });
    }

    endTurn()
    {
      this.setNextPlayer();
      this.processPlayerStartTurn(this.activePlayer);

      // TODO
      if (this.activePlayer !== this.humanPlayer)
      {
        this.endTurn();
      }

      eventManager.dispatchEvent("updateSelection", null);
    }
    processPlayerStartTurn(player: Player)
    {
      var resetShipMovementFN = function(ship: Unit)
      {
        ship.resetMovePoints();
      }

      player.forEachUnit(resetShipMovementFN);
    }

    setNextPlayer()
    {
      this.playerOrder.push(this.playerOrder.shift());

      this.activePlayer = this.playerOrder[0];
    }
  }
}