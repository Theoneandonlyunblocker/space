/// <reference path="../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import BattlePrepComponentFactory from "./battleprep/BattlePrep";
import BattleSceneTester from "./BattleSceneTester";
import SetupGame from "./setupgame/SetupGame";
import BattleComponentFactory from "./battle/Battle";
import GalaxyMap from "./galaxymap/GalaxyMap";
import FlagMaker from "./FlagMaker";

import BattlePrep from "../BattlePrep";
import MapRenderer from "../MapRenderer";
import Player from "../Player";
import PlayerControl from "../PlayerControl";
import Battle from "../Battle";
import Game from "../Game";
import Renderer from "../Renderer";

interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
  mapRenderer: MapRenderer;
  player: Player;
  playerControl: PlayerControl;
  battle: Battle;
  game: Game;
  sceneToRender: string;
  renderer: Renderer;
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
  }

  render()
  {
    var elementsToRender: React.ReactElement<any>[] = [];

    switch (this.props.sceneToRender)
    {
      case "battle":
      {
        elementsToRender.push(
          BattleComponentFactory(
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
          BattlePrepComponentFactory(
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
