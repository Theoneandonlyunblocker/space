/// <reference path="topmenu.ts"/>
/// <reference path="topbar.ts"/>
/// <reference path="fleetselection.ts"/>
/// <reference path="starinfo.ts"/>
/// <reference path="../possibleactions/possibleactions.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMapUI = React.createClass(
    {
      displayName: "GalaxyMapUI",

      getInitialState: function()
      {
        var pc = this.props.playerControl;

        return(
        {
          selectedFleets: pc.selectedFleets,
          currentlyReorganizing: pc.currentlyReorganizing,
          selectedStar: pc.selectedStar,
          attackTargets: pc.currentAttackTargets,
          isPlayerTurn: !this.props.game.playerOrder[0].isAI
        });
      },

      endTurn: function()
      {
        this.props.game.endTurn();
      },

      setPlayerTurn: function()
      {
        this.setState(
        {
          isPlayerTurn: !this.props.game.activePlayer.isAI
        });
      },

      updateSelection: function()
      {
        var pc = this.props.playerControl;

        var star = null;
        if (pc.selectedStar) star = pc.selectedStar;
        else if (pc.areAllFleetsInSameLocation())
        {
          star = pc.selectedFleets[0].location;
        };

        this.setState(
        {
          selectedFleets: pc.selectedFleets,
          currentlyReorganizing: pc.currentlyReorganizing,
          selectedStar: star,
          attackTargets: pc.currentAttackTargets
        });
      },

      closeReorganization: function()
      {
        eventManager.dispatchEvent("endReorganizingFleets");
        this.updateSelection();
      },

      render: function()
      {
        var endTurnButtonProps =
        {
          className: "end-turn-button",
          onClick: this.endTurn
        }
        if (!this.state.isPlayerTurn)
        {
          endTurnButtonProps.className += " disabled";
        }

        return(
          React.DOM.div(
          {
            className: "galaxy-map-ui"
          },
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
                player: this.props.player
              }),
              React.DOM.div(
              {
                className: "fleet-selection-container"
              },
                UIComponents.FleetSelection(
                {
                  selectedFleets: this.state.selectedFleets,
                  currentlyReorganizing: this.state.currentlyReorganizing,
                  closeReorganization: this.closeReorganization
                })
              )
            ),
            
            React.DOM.div(
            {
              className: "galaxy-map-ui-bottom-left"
            },
              UIComponents.PossibleActions(
              {
                attackTargets: this.state.attackTargets,
                selectedStar: this.state.selectedStar,
                player: this.props.player
              }),
              UIComponents.StarInfo(
              {
                selectedStar: this.state.selectedStar
              })
            ),
            React.DOM.button(endTurnButtonProps, "End turn")
          )
        );
      },

      componentWillMount: function()
      {
        eventManager.addEventListener("playerControlUpdated",
          this.updateSelection);

        eventManager.addEventListener("endTurn",
          this.setPlayerTurn);
      },
      componentWillUnmount: function()
      {
        eventManager.removeEventListener("playerControlUpdated",
          this.updateSelection);

        eventManager.removeEventListener("endTurn",
          this.setPlayerTurn);
      }
    });
  }
}
