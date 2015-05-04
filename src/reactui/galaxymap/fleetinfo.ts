/// <reference path="fleetcontrols.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetInfo = React.createClass(
    {
      displayName: "FleetInfo",
      setFleetName: function(e)
      {
        console.log("setFleetName", e.target.value);
        this.props.fleet.name = e.target.value;
        this.forceUpdate();
      },

      render: function()
      {
        var fleet = this.props.fleet;
        if (!fleet) return null;
        var totalHealth = fleet.getTotalHealth();

        return(
          React.DOM.div(
          {
            className: "fleet-info"
          },
            React.DOM.div(
            {
              className: "fleet-info-header"
            },
              React.DOM.input(
              {
                className: "fleet-info-name",
                value: fleet.name,
                onChange: this.setFleetName
              }),
              React.DOM.div(
              {
                className: "fleet-info-shipcount"
              }, fleet.ships.length),
              React.DOM.div(
              {
                className: "fleet-info-strength"
              }, totalHealth.current + "/" + totalHealth.max),
              UIComponents.FleetControls(
              {
                fleet: fleet,
                hasMultipleSelected: this.props.hasMultipleSelected
              })
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
