/// <reference path="../../lib/react-global.d.ts" />

import BattleSceneTester from "./BattleSceneTester";
import FlagMaker from "./FlagMaker";
import BattleComponentFactory from "./battle/Battle";
import BattlePrepComponentFactory from "./battleprep/BattlePrep";
import GalaxyMap from "./galaxymap/GalaxyMap";
import SetupGame from "./setupgame/SetupGame";
import SFXEditor from "./sfxeditor/SFXEditor";

import Battle from "../Battle";
import BattlePrep from "../BattlePrep";
import Game from "../Game";
import MapRenderer from "../MapRenderer";
import NotificationLog from "../NotificationLog";
import Player from "../Player";
import PlayerControl from "../PlayerControl";
import ReactUIScene from "../ReactUIScene";
import Renderer from "../Renderer";

import {Language} from "../localization/Language";


export interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
  mapRenderer: MapRenderer;
  player: Player;
  playerControl: PlayerControl;
  battle: Battle;
  game: Game;
  sceneToRender: ReactUIScene;
  renderer: Renderer;
  activeLanguage: Language;
  notificationLog: NotificationLog;
}

interface StateType
{
}

export class StageComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "Stage";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const elementsToRender: React.ReactElement<any>[] = [];

    switch (this.props.sceneToRender)
    {
      case "battle":
      {
        elementsToRender.push(
          BattleComponentFactory(
          {
            battle: this.props.battle,
            humanPlayer: this.props.player,
            // activeLanguage: this.props.activeLanguage,
            key: "battle",
          }),
        );
        break;
      }
      case "battlePrep":
      {
        elementsToRender.push(
          BattlePrepComponentFactory(
          {
            battlePrep: this.props.battlePrep,
            // activeLanguage: this.props.activeLanguage,
            key: "battlePrep",
          }),
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
            activeLanguage: this.props.activeLanguage,
            notificationLog: this.props.notificationLog,
            key: "galaxyMap",
          }),
        );
        break;
      }
      case "flagMaker":
      {
        elementsToRender.push(
          FlagMaker(
          {
            // activeLanguage: this.props.activeLanguage,
            key: "flagMaker",
          }),
        );
        break;
      }
      case "setupGame":
      {
        elementsToRender.push(
          SetupGame(
          {
            activeLanguage: this.props.activeLanguage,
            key: "setupGame",
          }),
        );
        break;
      }
      case "battleSceneTester":
      {
        elementsToRender.push(
          BattleSceneTester(
          {
            // activeLanguage: this.props.activeLanguage,
            key: "battleSceneTester",
          }),
        );
        break;
      }
      case "SFXEditor":
      {
        elementsToRender.push(
          SFXEditor(
          {
            // activeLanguage: this.props.activeLanguage,
            key: "SFXEditor",
          }),
        );
        break;
      }
    }

    return(
      React.DOM.div({className: "react-stage"},
        elementsToRender,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(StageComponent);
export default Factory;
