import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {app} from "../../../../src/app/App"; // TODO global
import {GameModuleInitializationPhase} from "../../../../src/modules/GameModuleInitializationPhase";
import {MapGenFunction} from "../../../../src/templateinterfaces/MapGenFunction";

import {MapSetup, MapSetupComponent} from "./MapSetup";
import {SetupGamePlayers, SetupGamePlayersComponent} from "./SetupGamePlayers";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  maxPlayers: number;
  minPlayers: number;
}

export class SetupGameComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SetupGame";
  public state: StateType;

  private readonly setupPlayersComponent = React.createRef<SetupGamePlayersComponent>();
  private readonly mapSetupComponent = React.createRef<MapSetupComponent>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.startGame = this.startGame.bind(this);
    this.randomize = this.randomize.bind(this);
    this.setPlayerLimits = this.setPlayerLimits.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      minPlayers: 1,
      maxPlayers: 5,
    });
  }

  private setPlayerLimits(props:
  {
    min: number;
    max: number;
  })
  {
    this.setState(
    {
      minPlayers: props.min,
      maxPlayers: props.max,
    });
  }
  private startGame()
  {
    app.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase.MapGen).then(() =>
    {
      const players = this.setupPlayersComponent.current.makeAllPlayers();

      const mapSetupInfo = this.mapSetupComponent.current.getMapSetupInfo();
      const mapGenFunction: MapGenFunction = mapSetupInfo.template.mapGenFunction;

      const mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
      const map = mapGenResult.makeMap();

      app.makeGameFromSetup(map, players);
    });
  }
  private async randomize(): Promise<void>
  {
    await this.mapSetupComponent.current.randomize();
    await this.setupPlayersComponent.current.randomizeAllPlayers();
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "setup-game-wrapper",
      },
        ReactDOMElements.div(
        {
          className: "setup-game",
        },
          ReactDOMElements.div(
          {
            className: "setup-game-options",
          },
            SetupGamePlayers(
            {
              ref: this.setupPlayersComponent,
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers,
            }),
            MapSetup(
            {
              setPlayerLimits: this.setPlayerLimits,
              ref: this.mapSetupComponent,
            }),
          ),
          ReactDOMElements.div(
          {
            className: "setup-game-buttons",
          },
            ReactDOMElements.button(
            {
              className: "setup-game-button setup-game-button-randomize",
              onClick: this.randomize,
            }, localize("randomize").toString()),
            ReactDOMElements.button(
            {
              className: "setup-game-button setup-game-button-start",
              onClick: this.startGame,
            }, localize("startGame").toString()),
          ),
        ),
      )
    );
  }
}

export const SetupGame: React.Factory<PropTypes> = React.createFactory(SetupGameComponent);
