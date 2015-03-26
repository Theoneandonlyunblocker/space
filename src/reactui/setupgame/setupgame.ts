/// <reference path="setupgameplayers.ts" />

module Rance
{
  export module UIComponents
  {
    export var SetupGame = React.createClass(
    {
      displayName: "SetupGame",

      getInitialState: function()
      {
        return(
        {
          minPlayers: 1,
          maxPlayers: 5
        });
      },


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

      randomizeAllPlayers: function()
      {
        this.refs.players.randomizeAllPlayers();
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
              ref: "players",
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers
            }),
            React.DOM.button(
            {
              onClick: this.randomizeAllPlayers
            }, "Randomize all"),
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
