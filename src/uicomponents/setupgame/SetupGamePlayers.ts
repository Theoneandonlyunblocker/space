/// <reference path="../../../lib/react-global.d.ts" />


import Player from "../../Player";
import Flag from "../../Flag";
import {default as PlayerSetup, PlayerSetupComponent} from "./PlayerSetup";
import Color from "../../Color";
import {ColorSetterComponent} from "./ColorSetter";


interface PropTypes extends React.Props<any>
{
  maxPlayers: number;
  minPlayers: number;
}

interface StateType
{
  activeColorSetter?: ColorSetterComponent;
  playerKeys?: number[];
}

export class SetupGamePlayersComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "SetupGamePlayers";

  state: StateType;
  newPlayerID: number = 0;
  playerSetupComponentsByID:
  {
    [playerID: number]: PlayerSetupComponent;
  } = {};

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeNewPlayers = this.makeNewPlayers.bind(this);
    this.makeAllPlayers = this.makeAllPlayers.bind(this);
    this.setActiveColorSetter = this.setActiveColorSetter.bind(this);
    this.setHumanPlayer = this.setHumanPlayer.bind(this);
    this.randomizeAllPlayers = this.randomizeAllPlayers.bind(this);
    this.removePlayers = this.removePlayers.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    var players: number[] = [];
    for (let i = 0; i < this.props.maxPlayers; i++)
    {
      players.push(this.newPlayerID++);
    }

    return(
    {
      playerKeys: players,
      activeColorSetter: null
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.minPlayers > this.state.playerKeys.length)
    {
      this.makeNewPlayers(newProps.minPlayers - this.state.playerKeys.length);
    }
    else if (newProps.maxPlayers < this.state.playerKeys.length)
    {
      var overflowCount = this.state.playerKeys.length - newProps.maxPlayers;
      this.removePlayers(this.state.playerKeys.slice(-overflowCount));
    }
  }

  makeNewPlayers(amountToMake: number = 1)
  {
    if (this.state.playerKeys.length >= this.props.maxPlayers)
    {
      return;
    }

    var newIds: number[] = [];

    for (let i = 0; i < amountToMake; i++)
    {
      newIds.push(this.newPlayerID++);
    }

    this.setState(
    {
      playerKeys: this.state.playerKeys.concat(newIds)
    });
  }

  setHumanPlayer(playerId: number)
  {
    var index = this.state.playerKeys.indexOf(playerId);

    var newPlayerOrder = this.state.playerKeys.slice(0);

    newPlayerOrder.unshift(newPlayerOrder.splice(index, 1)[0]);

    this.setState({playerKeys: newPlayerOrder});
  }

  removePlayers(toRemove: number[])
  {
    if (this.state.playerKeys.length <= this.props.minPlayers)
    {
      return;
    }

    this.setState(
    {
      playerKeys: this.state.playerKeys.filter(function(playerId: number)
      {
        return toRemove.indexOf(playerId) === -1;
      })
    });
  }

  setActiveColorSetter(colorSetter: ColorSetterComponent)
  {
    if (this.state.activeColorSetter)
    {
      this.state.activeColorSetter.setAsInactive();
    }

    this.setState({activeColorSetter: colorSetter});
  }

  randomizeAllPlayers()
  {
    for (let id in this.playerSetupComponentsByID)
    {
      var player = this.playerSetupComponentsByID[id];

      player.randomize();
    }
  }

  makeAllPlayers()
  {
    var players: Player[] = [];
    for (let id in this.playerSetupComponentsByID)
    {
      players.push(this.playerSetupComponentsByID[id].makePlayer());
    }

    return players;
  }

  render()
  {
    var playerSetups: React.ReactElement<any>[] = [];
    for (let i = 0; i < this.state.playerKeys.length; i++)
    {
      playerSetups.push(PlayerSetup(
      {
        key: this.state.playerKeys[i],
        keyTODO: this.state.playerKeys[i],
        ref: (component: PlayerSetupComponent) =>
        {
          this.playerSetupComponentsByID[i] = component;
        },
        removePlayers: this.removePlayers,
        setActiveSetterComponent: this.setActiveColorSetter,
        initialName: "Player " + this.state.playerKeys[i],
        isHuman: i === 0,
        setHuman: this.setHumanPlayer
      }));
    }


    var canAddPlayers = this.state.playerKeys.length < this.props.maxPlayers;

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

const Factory: React.Factory<PropTypes> = React.createFactory(SetupGamePlayersComponent);
export default Factory;
