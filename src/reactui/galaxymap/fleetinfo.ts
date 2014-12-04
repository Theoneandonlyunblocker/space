/// <reference path="fleetcontrols.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetInfo = React.createClass(
    {
      displayName: "FleetInfo",
      render: function()
      {
        var fleet = this.props.fleet;
        if (!fleet) return null;
        var totalStrength = fleet.getTotalStrength();

        return(
          React.DOM.div(
          {
            className: "fleet-info"
          },
            React.DOM.div(
            {
              className: "fleet-info-header"
            },
              React.DOM.div(
              {
                className: "fleet-info-name"
              }, fleet.name),
              React.DOM.div(
              {
                className: "fleet-info-shipcount"
              }, fleet.ships.length),
              React.DOM.div(
              {
                className: "fleet-info-strength"
              }, totalStrength.current + "/" + totalStrength.max),
              React.DOM.div(
              {
                className: "fleet-info-contols"
              },
                UIComponents.FleetControls(
                {
                  fleet: fleet,
                  hasMultipleSelected: this.props.hasMultipleSelected
                })
              )
            ),
            React.DOM.div(
            {
              className: "fleet-info-move-points"
            },
              "Moves: " + fleet.getMinCurrentMovePoints() + "/" +
                fleet.getMinMaxMovePoints()
            )
            
          )
        );
      }
    });
  }
}
