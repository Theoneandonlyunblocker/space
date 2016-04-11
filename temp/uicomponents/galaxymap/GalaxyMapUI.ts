/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="topmenu.ts"/>
/// <reference path="topbar.ts"/>
/// <reference path="fleetselection.ts"/>
/// <reference path="starinfo.ts"/>
/// <reference path="../possibleactions/possibleactions.ts"/>
/// <reference path="../mapmodes/mapmodesettings.ts" />
/// <reference path="../notifications/notifications.ts" />
/// <reference path="../tutorials/introtutorial.ts" />


import MapModeSettings from "../mapmodes/MapModeSettings.ts";
import TopBar from "./TopBar.ts";
import Notifications from "../notifications/Notifications.ts";
import StarInfo from "./StarInfo.ts";
import FleetSelection from "./FleetSelection.ts";
import Star from "../../../src/Star.ts";
import TopMenu from "./TopMenu.ts";
import PossibleActions from "../possibleactions/PossibleActions.ts";
import IntroTutorial from "../tutorials/IntroTutorial.ts";
import eventManager from "../../../src/eventManager.ts";



export interface PropTypes extends React.Props<any>
{
  game: any; // TODO refactor | define prop type 123
  mapRenderer: any; // TODO refactor | define prop type 123
  player: any; // TODO refactor | define prop type 123
  playerControl: any; // TODO refactor | define prop type 123
}

interface StateType
{
  attackTargets?: any; // TODO refactor | define state type 456
  hasMapModeSettingsExpanded?: any; // TODO refactor | define state type 456
  currentlyReorganizing?: any; // TODO refactor | define state type 456
  selectedFleets?: any; // TODO refactor | define state type 456
  inspectedFleets?: any; // TODO refactor | define state type 456
  isPlayerTurn?: any; // TODO refactor | define state type 456
  expandedActionElement?: any; // TODO refactor | define state type 456
  selectedStar?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  leftColumnContent: HTMLElement;
  expandedActionElementContainer: HTMLElement;
}

class GalaxyMapUI_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "GalaxyMapUI";

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
    this.clampExpandedActionElement = this.clampExpandedActionElement.bind(this);
    this.setExpandedActionElement = this.setExpandedActionElement.bind(this);
    this.closeReorganization = this.closeReorganization.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.toggleMapModeSettingsExpanded = this.toggleMapModeSettingsExpanded.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.setPlayerTurn = this.setPlayerTurn.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    var pc = this.props.playerControl;

    return(
    {
      selectedFleets: pc.selectedFleets,
      inspectedFleets: pc.inspectedFleets,
      currentlyReorganizing: pc.currentlyReorganizing,
      selectedStar: pc.selectedStar,
      attackTargets: pc.currentAttackTargets,
      isPlayerTurn: !this.props.game.playerOrder[0].isAI,
      expandedActionElement: null,
      hasMapModeSettingsExpanded: false
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

    var maxHeight = React.findDOMNode<HTMLElement>(this.refs.leftColumnContent).getBoundingClientRect().height;
    var listElement = React.findDOMNode<HTMLElement>(this.refs.expandedActionElementContainer).firstChild.firstChild;
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
      isPlayerTurn: !this.props.game.activePlayer.isAI
    });
  }

  setExpandedActionElement(element: React.ReactElement<any>)
  {
    this.setState(
    {
      expandedActionElement: element
    });
  }

  toggleMapModeSettingsExpanded()
  {
    this.setState({hasMapModeSettingsExpanded: !this.state.hasMapModeSettingsExpanded});
  }

  updateSelection()
  {
    var pc = this.props.playerControl;

    var star: Star = null;
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
      attackTargets: pc.currentAttackTargets
    });
  }

  closeReorganization()
  {
    eventManager.dispatchEvent("endReorganizingFleets");
    this.updateSelection();
  }

  render()
  {
    var endTurnButtonProps: any =
    {
      className: "end-turn-button",
      onClick: this.endTurn,
      tabIndex: -1
    }
    if (!this.state.isPlayerTurn)
    {
      endTurnButtonProps.className += " disabled";
      endTurnButtonProps.disabled = true;
    }

    var selectionContainerClassName = "fleet-selection-container";
    if (this.state.currentlyReorganizing.length > 0)
    {
      selectionContainerClassName += " reorganizing";
    }

    var isInspecting = this.state.inspectedFleets.length > 0;

    var expandedActionElement: React.HTMLElement = null;
    if (this.state.expandedActionElement)
    {
      expandedActionElement = React.DOM.div(
      {
        className: "galaxy-map-ui-bottom-left-column",
        ref: "expandedActionElementContainer"
      },
        this.state.expandedActionElement
      );
    }

    return(
      React.DOM.div(
      {
        className: "galaxy-map-ui"
      },
        IntroTutorial(),
        React.DOM.div(
        {
          className: "galaxy-map-ui-top"
        },
          TopBar(
          {
            player: this.props.player,
            game: this.props.game
          }),
          TopMenu(
          {
            player: this.props.player,
            game: this.props.game,
            log: this.props.game.notificationLog,
            currentTurn: this.props.game.turnNumber
          }),
          React.DOM.div(
          {
            className: selectionContainerClassName
          },
            FleetSelection(
            {
              selectedFleets: (isInspecting ?
                this.state.inspectedFleets : this.state.selectedFleets),
              isInspecting: isInspecting,
              selectedStar: this.state.selectedStar,
              currentlyReorganizing: this.state.currentlyReorganizing,
              closeReorganization: this.closeReorganization,
              player: this.props.player
            })
          )
        ),
        
        React.DOM.div(
        {
          className: "galaxy-map-ui-bottom-left",
          key: "bottomLeft"
        },
          React.DOM.div(
          {
            className: "galaxy-map-ui-bottom-left-column align-bottom",
            key: "bottomLeftColumn"
          },
            React.DOM.div(
            {
              className: "galaxy-map-ui-bottom-left-leftmost-column-wrapper",
              ref: "leftColumnContent",
              key: "leftColumnContent"
            },
              PossibleActions(
              {
                attackTargets: this.state.attackTargets,
                selectedStar: this.state.selectedStar,
                player: this.props.player,
                setExpandedActionElementOnParent: this.setExpandedActionElement,
                key: "possibleActions"
              }),
              StarInfo(
              {
                selectedStar: this.state.selectedStar,
                key: "starInfo"
              })
            )
          ),
          expandedActionElement
        ),
        React.DOM.div(
        {
          className: "galaxy-map-ui-bottom-right",
          key: "bottomRight"
        },
          !this.state.hasMapModeSettingsExpanded ? null : MapModeSettings(
          {
            mapRenderer: this.props.mapRenderer,
            key: "mapRendererLayersList"
          }),
          React.DOM.button(
          {
            className: "toggle-map-mode-settings-button",
            tabIndex: -1,
            onClick: this.toggleMapModeSettingsExpanded
          },
            "Map mode"
          ),
          Notifications(
          {
            log: this.props.game.notificationLog,
            currentTurn: this.props.game.turnNumber,
            key: "notifications"
          }),
          React.DOM.button(endTurnButtonProps, "End turn")
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(GalaxyMapUI_COMPONENT_TODO);
export default Factory;
