/// <reference path="fleetcontrols.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetInfo = React.createClass(
    {
      displayName: "FleetInfo",
      setFleetName: function(e: Event)
      {
        var target = <HTMLInputElement> e.target;
        console.log("setFleetName", target.value);
        this.props.fleet.name = target.value;
        this.forceUpdate();
      },

      render: function()
      {
        var fleet = this.props.fleet;
        if (!fleet) return null;
        var totalHealth = fleet.getTotalHealth();

        var healthRatio = totalHealth.current / totalHealth.max;
        var critThreshhold = 0.3;

        var healthStatus = "";

        if (healthRatio <= critThreshhold)
        {
          healthStatus += " critical";
        }
        else if (totalHealth.current < totalHealth.max)
        {
          healthStatus += " wounded";
        }

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
              }, 
                React.DOM.span(
                {
                  className: "fleet-info-strength-current" + healthStatus
                },
                  totalHealth.current
                ),
                React.DOM.span(
                {
                  className: "fleet-info-strength-max"
                },
                  "/" + totalHealth.max
                )
              ),
              UIComponents.FleetControls(
              {
                fleet: fleet,
                hasMultipleSelected: this.props.hasMultipleSelected,
                isInspecting: this.props.isInspecting
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
