/// <reference path="../../../lib/react-0.13.3.d.ts" />

import app from "../../../src/App.ts"; // TODO refactor | autogenerated
import * as React from "react";

/// <reference path="setupgameplayers.ts" />
/// <reference path="mapsetup.ts" />


import SetupGamePlayers from "./SetupGamePlayers.ts";
import MapSetup from "./MapSetup.ts";
import MapGenFunction from "../../../src/templateinterfaces/MapGenFunction.d.ts";


export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  maxPlayers?: any; // TODO refactor | define state type 456
  minPlayers?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  players: React.Component<any, any>; // TODO refactor | correct ref type 542 | SetupGamePlayers
  mapSetup: React.Component<any, any>; // TODO refactor | correct ref type 542 | MapSetup
}

class SetupGame_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "SetupGame";

  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.startGame = this.startGame.bind(this);
    this.randomize = this.randomize.bind(this);
    this.setPlayerLimits = this.setPlayerLimits.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      minPlayers: 1,
      maxPlayers: 5
    });
  }

  setPlayerLimits(props:
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

  startGame()
  {
    var playerData: any = {};

    var players = this.refs.players.makeAllPlayers();

    var mapSetupInfo = this.refs.mapSetup.getMapSetupInfo();

    var mapGenFunction: MapGenFunction = mapSetupInfo.template.mapGenFunction;

    var mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
    var map = mapGenResult.makeMap();

    app.makeGameFromSetup(map, players);
  }

  randomize()
  {
    this.refs.players.randomizeAllPlayers();
    this.refs.mapSetup.refs.mapGenOptions.randomizeOptions();
  }

  render()
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
            SetupGamePlayers(
            {
              ref: "players",
              minPlayers: this.state.minPlayers,
              maxPlayers: this.state.maxPlayers
            }),
            MapSetup(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SetupGame_COMPONENT_TODO);
export default Factory;
