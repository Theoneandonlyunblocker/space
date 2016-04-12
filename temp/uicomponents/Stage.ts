/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../lib/react-global-0.13.3.d.ts" />

/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="unitlist/itemequip.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="galaxymap/galaxymap.ts"/>
/// <reference path="setupgame/setupgame.ts"/>

/// <reference path="flagmaker.ts"/>
/// <reference path="battlescenetester.ts" />


import BattlePrep from "./battleprep/BattlePrep.ts";
import BattleSceneTester from "./BattleSceneTester.ts";
import SetupGame from "./setupgame/SetupGame.ts";
import Battle from "./battle/Battle.ts";
import GalaxyMap from "./galaxymap/GalaxyMap.ts";
import FlagMaker from "./FlagMaker.ts";


interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
  mapRenderer: MapRenderer;
  player: Player;
  playerControl: any; // TODO refactor | define prop type 123
  battle: any; // TODO refactor | define prop type 123
  game: any; // TODO refactor | define prop type 123
  changeSceneFunction: any; // TODO refactor | define prop type 123
  sceneToRender: any; // TODO refactor | define prop type 123
  renderer: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class StageComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Stage";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.changeScene = this.changeScene.bind(this);    
  }
  
  changeScene()
  {
    var newScene = React.findDOMNode<HTMLInputElement>(this.ref_TODO_sceneSelector).value;

    this.props.changeSceneFunction(newScene);
  }

  render()
  {
    var elementsToRender: React.ReactElement<any>[] = [];

    switch (this.props.sceneToRender)
    {
      case "battle":
      {
        elementsToRender.push(
          Battle(
          {
            battle: this.props.battle,
            humanPlayer: this.props.player,
            renderer: this.props.renderer,
            key: "battle"
          })
        );
        break;
      }
      case "battlePrep":
      {
        elementsToRender.push(
          BattlePrep(
          {
            battlePrep: this.props.battlePrep,
            renderer: this.props.renderer,
            key: "battlePrep"
          })
        );
        break;
      }
      case "galaxyMap":
      {
        elementsToRender.push(
          GalaxyMap(
          {
            renderer: this.props.renderer,
            mapRenderer: this.props.mapRenderer,
            playerControl: this.props.playerControl,
            player: this.props.player,
            game: this.props.game,
            key: "galaxyMap"
          })
        );
        break;
      }
      case "flagMaker":
      {
        elementsToRender.push(
          FlagMaker(
          {
            key: "flagMaker"
          })
        );
        break;
      }
      case "setupGame":
      {
        elementsToRender.push(
          SetupGame(
          {
            key: "setupGame"
          })
        );
        break;
      }
      case "battleSceneTester":
      {
        elementsToRender.push(
          BattleSceneTester(
          {
            key: "battleSceneTester"
          })
        );
        break;
      }
    }
    return(
      React.DOM.div({className: "react-stage"},
        elementsToRender
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(StageComponent);
export default Factory;
