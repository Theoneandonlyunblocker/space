/// <reference path="fleetselection.ts"/>
/// <reference path="fleetreorganization.ts"/>
/// <reference path="starinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMapUI = React.createClass({

      getInitialState: function()
      {
        return(
        {
          selectedFleets: this.props.playerControl.selectedFleets,
          currentlyReorganizing: this.props.playerControl.currentlyReorganizing,
          selectedStar: this.props.playerControl.selectedStar
        });
      },

      updateSelection: function()
      {
        this.setState(
        {
          selectedFleets: this.props.playerControl.selectedFleets,
          currentlyReorganizing: this.props.playerControl.currentlyReorganizing,
          selectedStar: this.props.playerControl.selectedStar
        });
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
              className: "fleet-selection-container"
            },
              UIComponents.FleetSelection(
              {
                selectedFleets: this.state.selectedFleets
              }),
              UIComponents.FleetReorganization(
              {
                fleets: this.state.currentlyReorganizing
              })
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
        eventManager.addEventListener("updateSelection", this.updateSelection);
      },
      componentWillUnmount: function()
      {
        eventManager.removeEventListener("updateSelection", this.updateSelection);
      }
    });
  }
}
