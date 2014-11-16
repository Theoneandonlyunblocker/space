/// <reference path="../../eventmanager.ts"/>
/// <reference path="../../star.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetInfo = React.createClass({

      render: function()
      {
        var fleet = this.props.fleet;
        return(
          React.DOM.div(
          {
            className: "fleet-info"
          },
            React.DOM.div(null, "owner: " + fleet.owner.id),
            UIComponents.UnitList(
            {
              units: fleet.ships
            })
          )
        );
      }
    });
  }
}
