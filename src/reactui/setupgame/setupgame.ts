/// <reference path="playersetup.ts" />

module Rance
{
  export module UIComponents
  {
    export var SetupGame = React.createClass(
    {
      displayName: "SetupGame",

      getInitialState: function()
      {
        this.newPlayerId = 0;

        return(
        {
          players: [],
          activeColorPicker: null
        });
      },

      makeNewPlayer: function()
      {
        this.setState(
        {
          players: this.state.players.concat(this.newPlayerId++)
        });
      },

      removePlayer: function(idToRemove: number)
      {
        this.setState(
        {
          players: this.state.players.filter(function(playerId)
          {
            return playerId !== idToRemove;
          })
        });
      },

      setActiveColorPicker: function(colorPicker)
      {
        if (this.state.activeColorPicker)
        {
          this.state.activeColorPicker.setAsInactive();
        }

        this.setState({activeColorPicker: colorPicker});
      },

      render: function()
      {
        var playerSetups: any[] = [];
        for (var i = 0; i < this.state.players.length; i++)
        {
          playerSetups.push(UIComponents.PlayerSetup(
          {
            key: this.state.players[i],
            removePlayer: this.removePlayer,
            setActiveColorPicker: this.setActiveColorPicker
          }));
        }
        return(
          React.DOM.div({className: "setup-game"},
            React.DOM.div({className: "setup-game-players"},
              playerSetups,
              React.DOM.div(
              {
                className: "player-setup player-setup-add-new",
                onClick: this.makeNewPlayer
              },
                "Add new player"
              )
            )
          )
        );
      }
    })
  }
}
