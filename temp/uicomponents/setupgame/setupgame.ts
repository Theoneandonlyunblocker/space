/// <reference path="setupgameplayers.ts" />
/// <reference path="mapsetup.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class SetupGame extends React.Component<PropTypes, {}>
{
  displayName: "SetupGame";

  getInitialState: function()
  {
    return(
    {
      minPlayers: 1,
      maxPlayers: 5
    });
  }

  setPlayerLimits: function(props:
  {
    min: number;
    max: number;
  })
  {
    this.setState(
    {
      minPlayers: props.min,
      maxPlayers: props.max
    });
  }

  startGame: function()
  {
    var playerData: any = {};

    var players = this.refs.players.makeAllPlayers();

    var mapSetupInfo = this.refs.mapSetup.getMapSetupInfo();

    var mapGenFunction: Templates.IMapGenFunction = mapSetupInfo.template.mapGenFunction;

    var mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
    var map = mapGenResult.makeMap();

    app.makeGameFromSetup(map, players);
  }

  randomize: function()
  {
    this.refs.players.randomizeAllPlayers();
    this.refs.mapSetup.refs.mapGenOptions.randomizeOptions();
  }

  render: function()
  {
    return(
      React.DOM.div(
      {
        className: "setup-game-wrapper"
      },
        React.DOM.div(
        {
          className: "setup-game"
        },
          React.DOM.div(
          {
            className: "setup-game-options"
          },
            UIComponents.SetupGamePlayers(
            {
              ref: "players",
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers
            }),
            UIComponents.MapSetup(
            {
              setPlayerLimits: this.setPlayerLimits,
              ref: "mapSetup"
            })
          ),
          React.DOM.div(
          {
            className: "setup-game-buttons"
          },
            React.DOM.button(
            {
              className: "setup-game-button setup-game-button-randomize",
              onClick: this.randomize
            }, "Randomize"),
            React.DOM.button(
            {
              className: "setup-game-button setup-game-button-start",
              onClick: this.startGame
            }, "Start game")
          )
        )
      )
    );
  }
}
