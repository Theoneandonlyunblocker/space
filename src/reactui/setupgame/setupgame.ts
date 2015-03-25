/// <reference path="setupgameplayers.ts" />

module Rance
{
  export module UIComponents
  {
    export var SetupGame = React.createClass(
    {
      displayName: "SetupGame",

      startGame: function()
      {
        var gameData: any = {};

        var players = this.refs.players.makeAllPlayers();

        var pirates = new Player(true);
        pirates.setupPirates();

        gameData.playerData =
        {
          players: players,
          independents: pirates
        }

        app.makeGameFromSetup(gameData);
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "setup-game"
          },
            UIComponents.SetupGamePlayers(
            {
              ref: "players"
            }),
            React.DOM.button(
            {
              onClick: this.startGame
            }, "Start game")
          )
        );
      }
    })
  }
}
