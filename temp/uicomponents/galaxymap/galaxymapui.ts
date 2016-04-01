/// <reference path="topmenu.ts"/>
/// <reference path="topbar.ts"/>
/// <reference path="fleetselection.ts"/>
/// <reference path="starinfo.ts"/>
/// <reference path="../possibleactions/possibleactions.ts"/>
/// <reference path="../mapmodes/mapmodesettings.ts" />
/// <reference path="../notifications/notifications.ts" />
/// <reference path="../tutorials/introtutorial.ts" />


export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class GalaxyMapUI extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = "GalaxyMapUI";

  getInitialState: function()
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

  componentWillMount: function()
  {
    eventManager.addEventListener("playerControlUpdated",
      this.updateSelection);

    eventManager.addEventListener("endTurn",
      this.setPlayerTurn);
  }
  componentWillUnmount: function()
  {
    eventManager.removeEventListener("playerControlUpdated",
      this.updateSelection);

    eventManager.removeEventListener("endTurn",
      this.setPlayerTurn);
  }

  componentDidUpdate: function()
  {
    this.clampExpandedActionElement();
  }

  clampExpandedActionElement: function()
  {
    if (!this.state.expandedActionElement) return;

    var maxHeight = this.refs.leftColumnContent.getDOMNode().getBoundingClientRect().height;
    var listElement = this.refs.expandedActionElementContainer.getDOMNode().firstChild.firstChild;
    listElement.style.maxHeight = "" + (maxHeight - 10) + "px";
  }

  endTurn: function()
  {
    this.props.game.endTurn();
  }

  setPlayerTurn: function()
  {
    this.setState(
    {
      isPlayerTurn: !this.props.game.activePlayer.isAI
    });
  }

  setExpandedActionElement: function(element: ReactComponentPlaceHolder)
  {
    this.setState(
    {
      expandedActionElement: element
    });
  }

  toggleMapModeSettingsExpanded: function()
  {
    this.setState({hasMapModeSettingsExpanded: !this.state.hasMapModeSettingsExpanded});
  }

  updateSelection: function()
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

  closeReorganization: function()
  {
    eventManager.dispatchEvent("endReorganizingFleets");
    this.updateSelection();
  }

  render: function()
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

    var expandedActionElement: ReactDOMPlaceHolder = null;
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
        UIComponents.IntroTutorial(),
        React.DOM.div(
        {
          className: "galaxy-map-ui-top"
        },
          UIComponents.TopBar(
          {
            player: this.props.player,
            game: this.props.game
          }),
          UIComponents.TopMenu(
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
            UIComponents.FleetSelection(
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
              UIComponents.PossibleActions(
              {
                attackTargets: this.state.attackTargets,
                selectedStar: this.state.selectedStar,
                player: this.props.player,
                setExpandedActionElementOnParent: this.setExpandedActionElement,
                key: "possibleActions"
              }),
              UIComponents.StarInfo(
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
          !this.state.hasMapModeSettingsExpanded ? null : UIComponents.MapModeSettings(
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
          UIComponents.Notifications(
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
