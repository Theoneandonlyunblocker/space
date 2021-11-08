import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Game} from "core/src/game/Game";
import {MapRenderer} from "core/src/maprenderer/MapRenderer";
import {Player} from "core/src/player/Player";
import {PlayerControl} from "core/src/interaction/PlayerControl";
import {Renderer} from "core/src/graphics/Renderer";
import {Language} from "core/src/localization/Language";
import { Notification } from "core/src/notifications/Notification";
import { NotificationSubscriber } from "core/src/notifications/NotificationSubscriber";

import {GalaxyMapUI} from "./GalaxyMapUI";
import {GameOverScreen} from "./GameOverScreen";


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
  public override state: StateType;

  private readonly pixiContainer = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "galaxy-map",
      },
        ReactDOMElements.div(
        {
          id: "pixi-container",
          ref: this.pixiContainer,
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
      )
    );
  }


  public override componentDidMount()
  {
    this.props.renderer.bindRendererView(this.pixiContainer.current);
    this.props.mapRenderer.setMapModeByKey("defaultMapMode");

    this.props.renderer.camera.getBoundsObjectBoundsFN = this.props.mapRenderer.getMapBoundsForCamera.bind(this.props.mapRenderer);

    this.props.renderer.resume();

    // TODO hack | transparency isn't properly rendered without this
    this.props.mapRenderer.setAllLayersAsDirty();
  }
  public override componentWillUnmount()
  {
    this.props.renderer.pause();
    this.props.renderer.removeRendererView();
  }
}

export const GalaxyMap: React.Factory<PropTypes> = React.createFactory(GalaxyMapComponent);
