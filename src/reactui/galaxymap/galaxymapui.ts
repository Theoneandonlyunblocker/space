/// <reference path="topbar.ts"/>
/// <reference path="fleetselection.ts"/>
/// <reference path="fleetreorganization.ts"/>
/// <reference path="starinfo.ts"/>
/// <reference path="../possibleactions/possibleactions.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMapUI = React.createClass({

      endTurn: function()
      {
        eventManager.dispatchEvent("endTurn", null);
      },

      getInitialState: function()
      {
        var pc = this.props.playerControl;

        return(
        {
          selectedFleets: pc.selectedFleets,
          currentlyReorganizing: pc.currentlyReorganizing,
          selectedStar: pc.selectedStar,
          attackTargets: pc.currentAttackTargets
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
                player: this.props.player
              }),
              React.DOM.div(
              {
                className: "fleet-selection-container"
              },
                UIComponents.FleetSelection(
                {
                  selectedFleets: this.state.selectedFleets
                }),
                UIComponents.FleetReorganization(
                {
                  fleets: this.state.currentlyReorganizing,
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
              React.DOM.button(
              {
                onClick: this.endTurn
              }, "End turn")
            ),
            
            UIComponents.StarInfo(
            {
              selectedStar: this.state.selectedStar
            })
          )
        );
      },

      componentWillMount: function()
      {
        eventManager.addEventListener("playerControlUpdated",
          this.updateSelection);
      },
      componentWillUnmount: function()
      {
        eventManager.removeEventListener("playerControlUpdated",
          this.updateSelection);
      }
    });
  }
}
