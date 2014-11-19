/// <reference path="fleetcontents.ts"/>

module Rance
{
  export module UIComponents
  {
    export var ReorganizeFleet = React.createClass({

      render: function()
      {
        var selectedFleets = this.props.fleets;

        return(
          React.DOM.div(
          {
            className: "reorganize-fleet"
          },
            React.DOM.div(
            {
              className: "reorganize-fleet-header"
            }, null),
            React.DOM.div(
            {
              className: "reorganize-fleet-subheader"
            },
              React.DOM.div(
              {
                className: "reorganize-fleet-subheader-left-fleet-name"
              }),
              React.DOM.div(
              {
                className: "reorganize-fleet-subheader-center"
              }),
              React.DOM.div(
              {
                className: "reorganize-fleet-subheader-right-fleet-name"
              })
            ),
            React.DOM.div(
            {
              className: "reorganize-fleet-contents"
            },
              UIComponents.FleetContents(
              {
                fleet: selectedFleets[0]
              }),
              React.DOM.div(
              {
                className: "reorganize-fleet-contents-divider"
              }),
              UIComponents.FleetContents(
              {
                fleet: selectedFleets[1]
              })
            )
          )
        );
      }

    });
  }
}
