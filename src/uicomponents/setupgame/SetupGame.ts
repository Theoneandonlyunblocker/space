import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import ModuleFileInitializationPhase from "../../ModuleFileInitializationPhase";
import MapGenFunction from "../../templateinterfaces/MapGenFunction";

import {default as MapSetup, MapSetupComponent} from "./MapSetup";
import {default as SetupGamePlayers, SetupGamePlayersComponent} from "./SetupGamePlayers";


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
  private setupPlayersComponent: SetupGamePlayersComponent;
  private mapSetupComponent: MapSetupComponent;

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
    app.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.MapGen).then(() =>
    {
      const players = this.setupPlayersComponent.makeAllPlayers();

      const mapSetupInfo = this.mapSetupComponent.getMapSetupInfo();
      const mapGenFunction: MapGenFunction = mapSetupInfo.template.mapGenFunction;

      const mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
      const map = mapGenResult.makeMap();

      app.makeGameFromSetup(map, players);
    });
  }
  private randomize()
  {
    this.setupPlayersComponent.randomizeAllPlayers();
    this.mapSetupComponent.mapGenOptionsComponent.randomizeOptions();
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
              ref: (component: SetupGamePlayersComponent) =>
              {
                this.setupPlayersComponent = component;
              },
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers,
            }),
            MapSetup(
            {
              setPlayerLimits: this.setPlayerLimits,
              ref: (component: MapSetupComponent) =>
              {
                this.mapSetupComponent = component;
              },
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
            }, localize("randomize")()),
            ReactDOMElements.button(
            {
              className: "setup-game-button setup-game-button-start",
              onClick: this.startGame,
            }, localize("startGame")()),
          ),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SetupGameComponent);
export default factory;
