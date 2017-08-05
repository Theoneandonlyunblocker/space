import * as React from "react";
import * as ReactDOM from "react-dom";


import Player from "../../Player";
import {ColorSetterComponent} from "./ColorSetter";
import {default as PlayerSetup, PlayerSetupComponent} from "./PlayerSetup";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  maxPlayers: number;
  minPlayers: number;
}

interface StateType
{
  activeColorSetter: ColorSetterComponent;
  playerKeys: number[];
}

export class SetupGamePlayersComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "SetupGamePlayers";

  state: StateType;
  newPlayerId: number = 0;
  playerSetupComponentsById:
  {
    [playerId: number]: PlayerSetupComponent;
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
    const players: number[] = [];
    for (let i = 0; i < this.props.maxPlayers; i++)
    {
      players.push(this.newPlayerId++);
    }

    return(
    {
      playerKeys: players,
      activeColorSetter: null,
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
      const overflowCount = this.state.playerKeys.length - newProps.maxPlayers;
      this.removePlayers(this.state.playerKeys.slice(-overflowCount));
    }
  }

  makeNewPlayers(amountToMake: number = 1)
  {
    if (this.state.playerKeys.length >= this.props.maxPlayers)
    {
      return;
    }

    const newIds: number[] = [];

    for (let i = 0; i < amountToMake; i++)
    {
      newIds.push(this.newPlayerId++);
    }

    this.setState(
    {
      playerKeys: this.state.playerKeys.concat(newIds),
    }, () =>
    {
      const ownDOMNode = ReactDOM.findDOMNode(this);
      ownDOMNode.scrollTop = ownDOMNode.scrollHeight;
    });
  }

  setHumanPlayer(playerId: number)
  {
    const index = this.state.playerKeys.indexOf(playerId);

    const newPlayerOrder = this.state.playerKeys.slice(0);

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
      }),
    }, () =>
    {
      this.cleanSetupComponentsById();
    });
  }

  private cleanSetupComponentsById(): void
  {
    for (let playerId in this.playerSetupComponentsById)
    {
      if (!this.playerSetupComponentsById[playerId])
      {
        delete this.playerSetupComponentsById[playerId];
      }
    };
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
    for (let id in this.playerSetupComponentsById)
    {
      const player = this.playerSetupComponentsById[id];

      player.randomize();
    }
  }

  makeAllPlayers()
  {
    const players: Player[] = [];
    for (let id in this.playerSetupComponentsById)
    {
      players.push(this.playerSetupComponentsById[id].makePlayer());
    }

    return players;
  }

  render()
  {
    const playerSetups: React.ReactElement<any>[] = [];
    this.state.playerKeys.forEach((playerId, i) =>
    {
      playerSetups.push(PlayerSetup(
      {
        key: playerId,
        keyTODO: playerId,
        ref: (component: PlayerSetupComponent) =>
        {
          this.playerSetupComponentsById[playerId] = component;
        },
        removePlayers: this.removePlayers,
        setActiveSetterComponent: this.setActiveColorSetter,
        // TODO 2017.07.18 | missing localization
        initialName: "Player " + playerId,
        isHuman: i === 0,
        setHuman: this.setHumanPlayer,
      }));
    });


    const canAddPlayers = this.state.playerKeys.length < this.props.maxPlayers;

    return(
      React.DOM.div({className: "setup-game-players"},
        React.DOM.div(
        {
          className: "player-setup setup-game-players-header",
        },
          React.DOM.div(
          {
            className: "player-setup-is-human",
          }),
          React.DOM.div(
          {
            className: "player-setup-name",
          }, localize("playerName")),
          React.DOM.div(
          {
            className: "player-setup-race-picker",
          }, localize("race")),
          React.DOM.div(
          {
            className: "color-setter",
          }, localize("color_1")),
          React.DOM.div(
          {
            className: "color-setter",
          }, localize("color_2")),
          React.DOM.div(
          {
            className: "flag-setter",
          }, localize("flag")),
          React.DOM.div(
          {
            className: "player-setup-remove-player",
          }, localize("remove")),
        ),
        React.DOM.div(
        {
          className: "player-setup-players-list",
        },
          playerSetups,
        ),
        React.DOM.div(
        {
          className: "setup-game-players-buttons",
        },
          React.DOM.button(
          {
            className: "setup-game-button",
            onClick: this.randomizeAllPlayers,
          },
            localize("randomize"),
          ),
          React.DOM.button(
          {
            className: "setup-game-players-add-new" + (canAddPlayers ? "" : " disabled"),
            onClick: this.makeNewPlayers.bind(this, 1),
            disabled: !canAddPlayers,
          },
            localize("addNewPlayer"),
          ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SetupGamePlayersComponent);
export default Factory;
