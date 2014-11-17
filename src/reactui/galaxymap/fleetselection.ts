/// <reference path="fleetinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetSelection = React.createClass({

      render: function()
      {
        var fleetInfos = [];

        for (var i = 0; i < this.props.selectedFleets.length; i++)
        {
          fleetInfos.push(UIComponents.FleetInfo(
          {
            key: i,
            fleet: this.props.selectedFleets[i]
          }));
        }

        return(
          React.DOM.div(
          {
            className: "fleet-selection"
          },
            fleetInfos
          )
        );
      }

    });
  }
}
