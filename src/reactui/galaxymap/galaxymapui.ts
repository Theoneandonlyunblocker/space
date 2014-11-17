/// <reference path="fleetselection.ts"/>

module Rance
{
  export module UIComponents
  {
    export var GalaxyMapUI = React.createClass({

      getInitialState: function()
      {
        return(
        {
          selectedFleets: []
        });
      },

      setSelectedFleets: function(e)
      {
        this.setState(
        {
          selectedFleets: e.data
        });
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "galaxy-map-ui"
          },
            UIComponents.FleetSelection(
            {
              selectedFleets: this.state.selectedFleets
            })
          )
        );
      },

      componentWillMount: function()
      {
        eventManager.addEventListener("selectFleets", this.setSelectedFleets);
      },
      componentWillUnmount: function()
      {
        eventManager.removeEventListener("selectFleets", this.setSelectedFleets);
      }
    });
  }
}
