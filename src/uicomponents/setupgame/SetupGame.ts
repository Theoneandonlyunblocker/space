import * as React from "react";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import ModuleFileLoadingPhase from "../../ModuleFileLoadingPhase";
import eventManager from "../../eventManager";
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
  ref_TODO_players: SetupGamePlayersComponent;
  ref_TODO_mapSetup: MapSetupComponent;

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
    eventManager.dispatchEvent("loadModulesNeededForPhase", ModuleFileLoadingPhase.MapGen, () =>
    {
      const players = this.ref_TODO_players.makeAllPlayers();

      const mapSetupInfo = this.ref_TODO_mapSetup.getMapSetupInfo();
      const mapGenFunction: MapGenFunction = mapSetupInfo.template.mapGenFunction;

      const mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
      const map = mapGenResult.makeMap();

      app.makeGameFromSetup(map, players);
    });
  }
  private randomize()
  {
    this.ref_TODO_players.randomizeAllPlayers();
    this.ref_TODO_mapSetup.ref_TODO_mapGenOptions.randomizeOptions();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "setup-game-wrapper",
      },
        React.DOM.div(
        {
          className: "setup-game",
        },
          React.DOM.div(
          {
            className: "setup-game-options",
          },
            SetupGamePlayers(
            {
              ref: (component: SetupGamePlayersComponent) =>
              {
                this.ref_TODO_players = component;
              },
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers,
            }),
            MapSetup(
            {
              setPlayerLimits: this.setPlayerLimits,
              ref: (component: MapSetupComponent) =>
              {
                this.ref_TODO_mapSetup = component;
              },
            }),
          ),
          React.DOM.div(
          {
            className: "setup-game-buttons",
          },
            React.DOM.button(
            {
              className: "setup-game-button setup-game-button-randomize",
              onClick: this.randomize,
            }, localize("randomize")()),
            React.DOM.button(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SetupGameComponent);
export default Factory;
