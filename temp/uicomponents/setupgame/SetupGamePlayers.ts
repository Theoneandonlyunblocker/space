/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="playersetup.ts" />


import Player from "../../../src/Player.ts";
import Flag from "../../../src/Flag.ts";
import PlayerSetup from "./PlayerSetup.ts";
import Color from "../../../src/Color.ts";


export interface PropTypes extends React.Props<any>
{
  maxPlayers: any; // TODO refactor | define prop type 123
  minPlayers: any; // TODO refactor | define prop type 123
}

interface StateType
{
  activeColorPicker?: any; // TODO refactor | define state type 456
  players?: any; // TODO refactor | define state type 456
}

class SetupGamePlayers_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "SetupGamePlayers";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeNewPlayers = this.makeNewPlayers.bind(this);
    this.makeAllPlayers = this.makeAllPlayers.bind(this);
    this.setActiveColorPicker = this.setActiveColorPicker.bind(this);
    this.setHumanPlayer = this.setHumanPlayer.bind(this);
    this.randomizeAllPlayers = this.randomizeAllPlayers.bind(this);
    this.removePlayers = this.removePlayers.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    this.newPlayerId = 0;

    var players: number[] = [];
    for (var i = 0; i < this.props.maxPlayers; i++)
    {
      players.push(this.newPlayerId++);
    }

    return(
    {
      players: players,
      activeColorPicker: null
    });
  }

  componentWillReceiveProps(newProps: any)
  {
    if (newProps.minPlayers > this.state.players.length)
    {
      this.makeNewPlayers(newProps.minPlayers - this.state.players.length);
    }
    else if (newProps.maxPlayers < this.state.players.length)
    {
      var overflowCount = this.state.players.length - newProps.maxPlayers;
      this.removePlayers(this.state.players.slice(-overflowCount));
    }
  }

  makeNewPlayers(amountToMake: number = 1)
  {
    if (this.state.players.length >= this.props.maxPlayers)
    {
      return;
    }

    var newIds: number[] = [];

    for (var i = 0; i < amountToMake; i++)
    {
      newIds.push(this.newPlayerId++);
    }

    this.setState(
    {
      players: this.state.players.concat(newIds)
    });
  }

  setHumanPlayer(playerId: number)
  {
    var index = this.state.players.indexOf(playerId);

    var newPlayerOrder = this.state.players.slice(0);

    newPlayerOrder.unshift(newPlayerOrder.splice(index, 1)[0]);

    this.setState({players: newPlayerOrder});
  }

  removePlayers(toRemove: number[])
  {
    if (this.state.players.length <= this.props.minPlayers)
    {
      return;
    }

    this.setState(
    {
      players: this.state.players.filter(function(playerId: number)
      {
        return toRemove.indexOf(playerId) === -1;
      })
    });
  }

  setActiveColorPicker(colorPicker: React.ReactElement<any>)
  {
    if (this.state.activeColorPicker)
    {
      this.state.activeColorPicker.setAsInactive();
    }

    this.setState({activeColorPicker: colorPicker});
  }

  randomizeAllPlayers()
  {
    for (var id in this.refs)
    {
      var player = this.refs[id];

      player.randomize();
    }
  }

  makeAllPlayers()
  {
    var players: Player[] = [];
    for (var id in this.refs)
    {
      players.push(this.refs[id].makePlayer());
    }

    return players;
  }

  render()
  {
    var playerSetups: any[] = [];
    for (var i = 0; i < this.state.players.length; i++)
    {
      playerSetups.push(PlayerSetup(
      {
        key: this.state.players[i],
        keyTODO: this.state.players[i],
        ref: this.state.players[i],
        removePlayers: this.removePlayers,
        setActiveColorPicker: this.setActiveColorPicker,
        initialName: "Player " + this.state.players[i],
        isHuman: i === 0,
        setHuman: this.setHumanPlayer
      }));
    }


    var canAddPlayers = this.state.players.length < this.props.maxPlayers;

    return(
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
        React.DOM.div(
        {
          className: "player-setup-players-list"
        },
          playerSetups
        ),
        React.DOM.div(
        {
          className: "setup-game-players-buttons"
        },
          React.DOM.button(
          {
            className: "setup-game-button",
            onClick: this.randomizeAllPlayers
          },
            "Randomize"
          ),
          React.DOM.button(
          {
            className: "setup-game-players-add-new" + (canAddPlayers ? "" : " disabled"),
            onClick: this.makeNewPlayers.bind(this, 1),
            disabled: !canAddPlayers
          },
            "Add new player"
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SetupGamePlayers_COMPONENT_TODO);
export default Factory;
