/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="eventmanager.ts"/>

module Rance
{
  export class Game
  {
    turnNumber: number;
    independents: Player[] = [];
    playerOrder: Player[];
    galaxyMap: GalaxyMap;
    humanPlayer: Player;
    activePlayer: Player;

    playerControl: PlayerControl;

    constructor(map: GalaxyMap,
      players: Player[], humanPlayer: Player)
    {
      this.galaxyMap = map;
      this.playerOrder = players;
      this.humanPlayer = humanPlayer;
      this.turnNumber = 1;

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
      else
      {
        this.turnNumber++;
      }

      eventManager.dispatchEvent("updateSelection", null);
    }
    processPlayerStartTurn(player: Player)
    {
      var shipStartTurnFN = function(ship: Unit)
      {
        ship.resetMovePoints();
        ship.heal();
      }

      player.forEachUnit(shipStartTurnFN);
      player.money += player.getIncome();
    }


    setNextPlayer()
    {
      this.playerOrder.push(this.playerOrder.shift());

      this.activePlayer = this.playerOrder[0];
    }
    serialize()
    {
      var data: any = {};

      data.galaxyMap = this.galaxyMap.serialize();
      data.players = this.playerOrder.map(function(player)
        {return player.serialize()})
      data.players = data.players.concat(this.independents.map(function(player)
      {
        return player.serialize();
      }));
      data.humanPlayerId = this.humanPlayer.id;

      return data;
    }
  }
}