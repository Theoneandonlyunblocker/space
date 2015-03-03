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
      map.game = this;
      
      this.playerOrder = players;
      this.humanPlayer = humanPlayer;
      this.turnNumber = 1;
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
        ship.timesActedThisTurn = 0;
      }

      player.forEachUnit(shipStartTurnFN);
      player.money += player.getIncome();

      var allResourceIncomeData = player.getResourceIncome();
      for (var resourceType in allResourceIncomeData)
      {
        var resourceData = allResourceIncomeData[resourceType];
        player.addResource(resourceData.resource, resourceData.amount);
      }
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
    save(name: string)
    {
      var saveString = "Rance.Save." + name;

      var date = new Date();

      var gameData = this.serialize();

      var stringified = JSON.stringify(
      {
        name: name,
        date: date,
        gameData: gameData,
        idGenerators: cloneObject(idGenerators)
      });

      localStorage.setItem(saveString, stringified);
    }
  }
}