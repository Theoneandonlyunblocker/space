import * as React from "react";
import * as ReactDOM from "react-dom";

import {Fleet} from "../../Fleet";
import FleetAttackTarget from "../../FleetAttackTarget";
import Game from "../../Game";
import MapRenderer from "../../MapRenderer";
import Player from "../../Player";
import PlayerControl from "../../PlayerControl";
import Star from "../../Star";
import {activePlayer} from "../../activePlayer";
import eventManager from "../../eventManager";

import {Language} from "../../localization/Language";

import MapModeSettings from "../mapmodes/MapModeSettings";

import NotificationLog from "../notifications/NotificationLog";

import PossibleActions from "../possibleactions/PossibleActions";

import IntroTutorial from "../tutorials/IntroTutorial";

import FleetSelection from "./FleetSelection";
import StarInfo from "./StarInfo";
import TopBar from "./TopBar";
import TopMenu from "./TopMenu";

import {localize} from "../../../localization/localize";

import { Notification } from "../../notifications/Notification";
import { NotificationSubscriber } from "../../notifications/NotificationSubscriber";


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
  expandedActionElement: React.ReactElement<any>;
  selectedStar: Star;
}

export class GalaxyMapUIComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "GalaxyMapUI";

  public state: StateType;
  ref_TODO_leftColumnContent: HTMLElement;
  ref_TODO_expandedActionElementContainer: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.clampExpandedActionElement = this.clampExpandedActionElement.bind(this);
    this.setExpandedActionElement = this.setExpandedActionElement.bind(this);
    this.closeReorganization = this.closeReorganization.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.toggleMapModeSettingsExpanded = this.toggleMapModeSettingsExpanded.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.setPlayerTurn = this.setPlayerTurn.bind(this);
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
      expandedActionElement: null,
      hasMapModeSettingsExpanded: false,
    });
  }

  componentWillMount()
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

  componentDidUpdate()
  {
    this.clampExpandedActionElement();
  }

  clampExpandedActionElement()
  {
    if (!this.state.expandedActionElement) return;

    const maxHeight = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_leftColumnContent).getBoundingClientRect().height;
    const listElement = <HTMLElement> ReactDOM.findDOMNode(this.ref_TODO_expandedActionElementContainer).firstChild.firstChild;
    listElement.style.maxHeight = "" + (maxHeight - 10) + "px";
  }

  endTurn()
  {
    this.props.game.endTurn();
  }

  setPlayerTurn()
  {
    this.setState(
    {
      isPlayerTurn: !this.props.game.playerToAct.isAI,
    });
  }

  setExpandedActionElement(element: React.ReactElement<any>)
  {
    this.setState(
    {
      expandedActionElement: element,
    });
  }

  toggleMapModeSettingsExpanded()
  {
    this.setState({hasMapModeSettingsExpanded: !this.state.hasMapModeSettingsExpanded});
  }

  updateSelection()
  {
    const pc = this.props.playerControl;

    let star: Star = null;
    if (pc.selectedStar) star = pc.selectedStar;
    else if (pc.areAllFleetsInSameLocation())
    {
      star = pc.selectedFleets[0].location;
    };

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

    let selectionContainerClassName = "fleet-selection-container";
    if (this.state.currentlyReorganizing.length > 0)
    {
      selectionContainerClassName += " reorganizing";
    }

    const isInspecting = this.state.inspectedFleets.length > 0;

    let expandedActionElement: React.ReactHTMLElement<any> = null;
    if (this.state.expandedActionElement)
    {
      expandedActionElement = React.DOM.div(
      {
        className: "galaxy-map-ui-bottom-left-column",
        ref: (component: HTMLElement) =>
        {
          this.ref_TODO_expandedActionElementContainer = component;
        },
      },
        this.state.expandedActionElement,
      );
    }

    return(
      React.DOM.div(
      {
        className: "galaxy-map-ui",
      },
        IntroTutorial(),
        React.DOM.div(
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
          }),
          React.DOM.div(
          {
            className: selectionContainerClassName,
          },
            FleetSelection(
            {
              selectedFleets: (isInspecting ?
                this.state.inspectedFleets : this.state.selectedFleets),
              isInspecting: isInspecting,
              selectedStar: this.state.selectedStar,
              currentlyReorganizing: this.state.currentlyReorganizing,
              closeReorganization: this.closeReorganization,
              player: this.props.player,
            }),
          ),
        ),

        React.DOM.div(
        {
          className: "galaxy-map-ui-bottom-left",
          key: "bottomLeft",
        },
          React.DOM.div(
          {
            className: "galaxy-map-ui-bottom-left-column align-bottom",
            key: "bottomLeftColumn",
          },
            React.DOM.div(
            {
              className: "galaxy-map-ui-bottom-left-leftmost-column-wrapper",
              ref: (component: HTMLElement) =>
              {
                this.ref_TODO_leftColumnContent = component;
              },
              key: "leftColumnContent",
            },
              PossibleActions(
              {
                attackTargets: this.state.attackTargets,
                selectedStar: this.state.selectedStar,
                player: this.props.player,
                setExpandedActionElementOnParent: this.setExpandedActionElement,
                key: "possibleActions",
              }),
              StarInfo(
              {
                selectedStar: this.state.selectedStar,
                key: "starInfo",
              }),
            ),
          ),
          expandedActionElement,
        ),
        React.DOM.div(
        {
          className: "galaxy-map-ui-bottom-right",
          key: "bottomRight",
        },
          !this.state.hasMapModeSettingsExpanded ? null : MapModeSettings(
          {
            mapRenderer: this.props.mapRenderer,
            key: "mapRendererLayersList",
          }),
          React.DOM.button(
          {
            className: "toggle-map-mode-settings-button",
            tabIndex: -1,
            onClick: this.toggleMapModeSettingsExpanded,
          },
            localize("mapMode")(),
          ),
          NotificationLog(
          {
            key: "notifications",
            currentTurn: this.props.game.turnNumber,
            notifications: this.props.notifications,
            notificationLog: this.props.notificationLog,
          }),
          React.DOM.button(endTurnButtonProps, localize("endTurn")()),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(GalaxyMapUIComponent);
export default Factory;
