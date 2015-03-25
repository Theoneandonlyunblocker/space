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

      setHumanPlayer: function(playerId: number)
      {
        var index = this.state.players.indexOf(playerId);

        var newPlayerOrder = this.state.players.slice(0);

        newPlayerOrder.unshift(newPlayerOrder.splice(index, 1)[0]);

        this.setState({players: newPlayerOrder});
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
            setActiveColorPicker: this.setActiveColorPicker,
            initialName: "Player " + this.state.players[i],
            isHuman: i === 0,
            setHuman: this.setHumanPlayer
          }));
        }
        return(
          React.DOM.div({className: "setup-game"},
            React.DOM.div({className: "setup-game-players"},
              React.DOM.div(
              {
                className: "player-setup setup-game-players-header"
              },
                React.DOM.div(
                {
                  className: "player-setup-is-human"
                }),
                React.DOM.div(
                {
                  className: "player-setup-name"
                }, "Name"),
                React.DOM.div(
                {
                  className: "color-setter"
                }, "Color 1"),
                React.DOM.div(
                {
                  className: "color-setter"
                }, "Color 2"),
                React.DOM.div(
                {
                  className: "flag-setter"
                }, "Flag"),
                React.DOM.div(
                {
                  className: "player-setup-remove-player"
                }, "Remove")
              ),
              playerSetups,
              React.DOM.button(
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
