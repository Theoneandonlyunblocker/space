import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Fleet} from "core/fleets/Fleet";
import {FleetAttackTarget} from "core/map/FleetAttackTarget";
import {Game} from "core/game/Game";
import {MapRenderer} from "core/maprenderer/MapRenderer";
import {Player} from "core/player/Player";
import {PlayerControl} from "core/interaction/PlayerControl";
import {Star} from "core/map/Star";
import {activePlayer} from "core/app/activePlayer";
import {eventManager} from "core/app/eventManager";
import {Language} from "core/localization/Language";
import { Notification } from "core/notifications/Notification";
import { NotificationSubscriber } from "core/notifications/NotificationSubscriber";
import {MapModeSettings} from "../mapmodes/MapModeSettings";
import {NotificationLog} from "../notifications/NotificationLog";
import {IntroTutorial} from "../tutorials/IntroTutorial";

import {GalaxyMapUILeft} from "./GalaxyMapUILeft";
import {TopBar} from "./TopBar";
import {TopMenu} from "./TopMenu";


export interface PropTypes extends React.Props<any>
{
  game: Game;
  mapRenderer: MapRenderer;
  player: Player;
  playerControl: PlayerControl;
  activeLanguage: Language;
  notifications: Notification[];
  notificationLog: NotificationSubscriber;
}

interface StateType
{
  attackTargets: FleetAttackTarget[];
  hasMapModeSettingsExpanded: boolean;
  currentlyReorganizing: Fleet[];
  selectedFleets: Fleet[];
  inspectedFleets: Fleet[];
  isPlayerTurn: boolean;
  selectedStar: Star;
}

export class GalaxyMapUIComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "GalaxyMapUI";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.closeReorganization = this.closeReorganization.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.toggleMapModeSettingsExpanded = this.toggleMapModeSettingsExpanded.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.setPlayerTurn = this.setPlayerTurn.bind(this);
    this.setSelectedStar = this.setSelectedStar.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    const pc = this.props.playerControl;

    return(
    {
      selectedFleets: pc.selectedFleets,
      inspectedFleets: pc.inspectedFleets,
      currentlyReorganizing: pc.currentlyReorganizing,
      selectedStar: pc.selectedStar,
      attackTargets: pc.currentAttackTargets,
      isPlayerTurn: this.props.game.playerToAct === activePlayer,
      hasMapModeSettingsExpanded: false,
    });
  }

  componentDidMount()
  {
    eventManager.addEventListener("playerControlUpdated",
      this.updateSelection);

    eventManager.addEventListener("endTurn",
      this.setPlayerTurn);
  }
  componentWillUnmount()
  {
    eventManager.removeEventListener("playerControlUpdated",
      this.updateSelection);

    eventManager.removeEventListener("endTurn",
      this.setPlayerTurn);
  }

  endTurn()
  {
    this.props.game.endTurn();
  }

  setPlayerTurn()
  {
    this.setState(
    {
      isPlayerTurn: !this.props.game.playerToAct.isAi,
    });
  }

  private toggleMapModeSettingsExpanded(): void
  {
    this.setState({hasMapModeSettingsExpanded: !this.state.hasMapModeSettingsExpanded});
  }

  updateSelection()
  {
    const pc = this.props.playerControl;

    let star: Star = null;
    if (pc.selectedStar) { star = pc.selectedStar; }
    else if (pc.areAllFleetsInSameLocation())
    {
      star = pc.selectedFleets[0].location;
    }

    this.setState(
    {
      selectedFleets: pc.selectedFleets,
      inspectedFleets: pc.inspectedFleets,
      currentlyReorganizing: pc.currentlyReorganizing,
      selectedStar: star,
      attackTargets: pc.currentAttackTargets,
    });
  }

  closeReorganization()
  {
    eventManager.dispatchEvent("endReorganizingFleets");
    this.updateSelection();
  }

  render()
  {
    const endTurnButtonProps: any =
    {
      className: "end-turn-button",
      onClick: this.endTurn,
      tabIndex: -1,
    };

    if (!this.state.isPlayerTurn)
    {
      endTurnButtonProps.className += " disabled";
      endTurnButtonProps.disabled = true;
    }

    const isInspecting = this.state.inspectedFleets.length > 0;

    return(
      ReactDOMElements.div(
      {
        className: "galaxy-map-ui hide-when-user-interacts-with-map",
      },
        IntroTutorial(),
        ReactDOMElements.div(
        {
          className: "galaxy-map-ui-top",
        },
          TopBar(
          {
            player: this.props.player,
            game: this.props.game,
          }),
          TopMenu(
          {
            player: this.props.player,
            game: this.props.game,
            activeLanguage: this.props.activeLanguage,
            selectedStar: this.state.selectedStar,
            setSelectedStar: this.setSelectedStar,
          }),
        ),
        GalaxyMapUILeft(
        {
          isInspecting: isInspecting,
          selectedFleets: (isInspecting ?
            this.state.inspectedFleets :
            this.state.selectedFleets),
          selectedStar: this.state.selectedStar,
          currentlyReorganizing: this.state.currentlyReorganizing,
          closeReorganization: this.closeReorganization,
          player: this.props.player,

          attackTargets: this.state.attackTargets,
        }),
        ReactDOMElements.div(
        {
          className: "galaxy-map-ui-bottom-right",
          key: "bottomRight",
        },
          !this.state.hasMapModeSettingsExpanded ? null : MapModeSettings(
          {
            mapRenderer: this.props.mapRenderer,
            key: "mapRendererLayersList",
          }),
          ReactDOMElements.button(
          {
            className: "toggle-map-mode-settings-button",
            tabIndex: -1,
            onClick: this.toggleMapModeSettingsExpanded,
          },
            localize("mapMode").toString(),
          ),
          NotificationLog(
          {
            key: "notifications",
            currentTurn: this.props.game.turnNumber,
            notifications: this.props.notifications,
            notificationLog: this.props.notificationLog,
          }),
          ReactDOMElements.button(endTurnButtonProps, localize("endTurn").toString()),
        ),
      )
    );
  }

  private setSelectedStar(star: Star | null): void
  {
    this.props.playerControl.selectStar(star);
  }
}

export const GalaxyMapUI: React.Factory<PropTypes> = React.createFactory(GalaxyMapUIComponent);
