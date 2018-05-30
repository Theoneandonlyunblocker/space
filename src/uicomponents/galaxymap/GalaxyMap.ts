import * as React from "react";
import * as ReactDOM from "react-dom";

import GalaxyMapUI from "./GalaxyMapUI";
import GameOverScreen from "./GameOverScreen";

import Game from "../../Game";
import MapRenderer from "../../MapRenderer";
import Player from "../../Player";
import PlayerControl from "../../PlayerControl";
import Renderer from "../../Renderer";

import {Language} from "../../localization/Language";

import { Notification } from "../../notifications/Notification";
import { NotificationSubscriber } from "../../notifications/NotificationSubscriber";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  playerControl: PlayerControl;
  game: Game;
  mapRenderer: MapRenderer;
  renderer: Renderer;
  activeLanguage: Language;
  notifications: Notification[];
  notificationLog: NotificationSubscriber;
}

interface StateType
{
}

export class GalaxyMapComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "GalaxyMap";
  public state: StateType;

  ref_TODO_pixiContainer: HTMLElement;
  ref_TODO_sceneSelector: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "galaxy-map",
      },
        React.DOM.div(
        {
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_pixiContainer = component;
          },
          id: "pixi-container",
        },
          this.props.game.hasEnded ?
            GameOverScreen() :
            GalaxyMapUI(
            {
              key: "galaxyMapUI",
              playerControl: this.props.playerControl,
              player: this.props.player,
              game: this.props.game,
              mapRenderer: this.props.mapRenderer,
              activeLanguage: this.props.activeLanguage,
              notifications: this.props.notifications,
              notificationLog: this.props.notificationLog,
            }),
        ),
        //,
        // !Options.debug.enabled ? null : React.DOM.div(
        // {
        //   className: "galaxy-map-debug debug"
        // },
        //   React.DOM.select(
        //     {
        //       className: "reactui-selector debug",
        //       ref: (component: HTMLElement) =>
        //       {
        //         this.ref_TODO_sceneSelector = component;
        //       },
        //       value: app.reactUI.currentScene,
              // onChange: (e: React.FormEvent) =>
              // {
              //   const target = e.currentTarget;
              //   app.reactUI.switchScene(target.value);
              // }
        //     },
        //     React.DOM.option({value: "galaxyMap"}, "map"),
        //     React.DOM.option({value: "flagMaker"}, "make flags"),
        //     React.DOM.option({value: "setupGame"}, "setup game"),
        //     React.DOM.option({value: "battleSceneTester"}, "battle scene test")
        //   ),
        //   React.DOM.button(
        //   {
        //     className: "debug",
        //     onClick: (e: React.FormEvent) =>
        //     {
        //       const target = e.currentTarget;

        //       const position = app.renderer.camera.container.position.clone();
        //       const zoom = app.renderer.camera.currZoom;
        //       app.destroy();

        //       app.initUI();

        //       app.game = app.makeGame();
        //       app.initGame();

        //       app.initDisplay();
        //       app.hookUI();
        //       app.reactUI.switchScene("galaxyMap");
        //       app.renderer.camera.zoom(zoom);
        //       app.renderer.camera.container.position = position;
        //     }
        //   },
        //     "Reset app"
        //   )
        // )
      )
    );
  }


  componentDidMount()
  {
    this.props.renderer.bindRendererView(ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_pixiContainer));
    this.props.mapRenderer.setMapModeByKey("defaultMapMode");

    this.props.renderer.camera.getBoundsObjectBoundsFN = this.props.mapRenderer.getMapBoundsForCamera.bind(this.props.mapRenderer);

    this.props.renderer.resume();

    // TODO hack | transparency isn't properly rendered without this
    this.props.mapRenderer.setAllLayersAsDirty();
  }
  componentWillUnmount()
  {
    this.props.renderer.pause();
    this.props.renderer.removeRendererView();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(GalaxyMapComponent);
export default Factory;
