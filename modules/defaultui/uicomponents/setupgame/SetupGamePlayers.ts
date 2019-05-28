import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";

import {default as PlayerSetup, PlayerSetupComponent} from "./PlayerSetup";
import {SetterComponentBase} from "./SetterComponentBase";


export interface PropTypes extends React.Props<any>
{
  maxPlayers: number;
  minPlayers: number;
}

interface StateType
{
  activeSetterComponent: SetterComponentBase;
  playerKeys: number[];
}

export class SetupGamePlayersComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SetupGamePlayers";
  public state: StateType;

  private newPlayerId: number = 0;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();
  private readonly playerSetupComponentsById:
  {
    [playerId: number]: React.RefObject<PlayerSetupComponent>;
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
    this.setActiveSetterComponent = this.setActiveSetterComponent.bind(this);
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
      activeSetterComponent: null,
    });
  }

  public componentDidUpdate(prevProps: PropTypes, prevState: StateType): void
  {
    if (this.props.minPlayers > prevState.playerKeys.length)
    {
      this.makeNewPlayers(this.props.minPlayers - prevState.playerKeys.length);
    }
    else if (this.props.maxPlayers < prevState.playerKeys.length)
    {
      const overflowCount = prevState.playerKeys.length - this.props.maxPlayers;
      this.removePlayers(prevState.playerKeys.slice(-overflowCount));
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
      const ownDOMNode = this.ownDOMNode.current;
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
      playerKeys: this.state.playerKeys.filter(playerId => toRemove.indexOf(playerId) === -1),
    }, () =>
    {
      this.cleanSetupComponentsById();
    });
  }

  private cleanSetupComponentsById(): void
  {
    for (const playerId in this.playerSetupComponentsById)
    {
      if (!this.playerSetupComponentsById[playerId].current)
      {
        delete this.playerSetupComponentsById[playerId];
      }
    }
  }

  private setActiveSetterComponent(setter: SetterComponentBase): void
  {
    if (this.state.activeSetterComponent)
    {
      this.state.activeSetterComponent.setAsInactive();
    }

    this.setState({activeSetterComponent: setter});
  }

  randomizeAllPlayers()
  {
    for (const id in this.playerSetupComponentsById)
    {
      const player = this.playerSetupComponentsById[id].current;

      player.randomize();
    }
  }

  makeAllPlayers()
  {
    return this.state.playerKeys.map(id =>
    {
      return this.playerSetupComponentsById[id].current.makePlayer();
    });
  }

  render()
  {
    const playerSetups: React.ReactElement<any>[] = [];
    this.state.playerKeys.forEach((playerId, i) =>
    {
      if (!this.playerSetupComponentsById[playerId])
      {
        this.playerSetupComponentsById[playerId] = React.createRef<PlayerSetupComponent>();
      }

      playerSetups.push(PlayerSetup(
      {
        key: playerId,
        keyTODO: playerId,
        ref: this.playerSetupComponentsById[playerId],
        removePlayers: this.removePlayers,
        setActiveSetterComponent: this.setActiveSetterComponent,
        // TODO 2017.07.18 | missing localization
        initialName: `Player ${playerId}`,
        isHuman: i === 0,
        setHuman: this.setHumanPlayer,
      }));
    });


    const canAddPlayers = this.state.playerKeys.length < this.props.maxPlayers;

    return(
      ReactDOMElements.div({className: "setup-game-players", ref: this.ownDOMNode},
        ReactDOMElements.div(
        {
          className: "player-setup setup-game-players-header",
        },
          ReactDOMElements.div(
          {
            className: "player-setup-is-human",
          }),
          ReactDOMElements.div(
          {
            className: "player-setup-name",
          }, localize("playerName")()),
          ReactDOMElements.div(
          {
            className: "player-setup-race-picker",
          }, localize("race")()),
          ReactDOMElements.div(
          {
            className: "color-setter",
          }, localize("color_1")()),
          ReactDOMElements.div(
          {
            className: "color-setter",
          }, localize("color_2")()),
          ReactDOMElements.div(
          {
            className: "flag-setter",
          }, localize("flag")()),
          ReactDOMElements.div(
          {
            className: "player-setup-remove-player",
          }, localize("remove")()),
        ),
        ReactDOMElements.div(
        {
          className: "player-setup-players-list",
        },
          playerSetups,
        ),
        ReactDOMElements.div(
        {
          className: "setup-game-players-buttons",
        },
          ReactDOMElements.button(
          {
            className: "setup-game-button",
            onClick: this.randomizeAllPlayers,
          },
            localize("randomize")(),
          ),
          ReactDOMElements.button(
          {
            className: "setup-game-players-add-new" + (canAddPlayers ? "" : " disabled"),
            onClick: this.makeNewPlayers.bind(this, 1),
            disabled: !canAddPlayers,
          },
            localize("addNewPlayer")(),
          ),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SetupGamePlayersComponent);
export default factory;
