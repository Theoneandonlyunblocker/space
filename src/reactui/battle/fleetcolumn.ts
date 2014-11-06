/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetColumn = React.createClass(
    {
      render: function()
      {
        var column = this.props.column;

        var units = [];

        for (var i = 0; i < column.length; i++)
        {
          var data: any = {};

          data.key = i;
          data.facesLeft = this.props.facesLeft;
          data.activeUnit = this.props.activeUnit;
          data.activeTargets = this.props.activeTargets;

          if (!column[i])
          {
            units.push(UIComponents.EmptyUnit(data));
          }
          else
          {
            data.unit = column[i];
            units.push(UIComponents.Unit(data));
          }
        }

        return(
          React.DOM.div({className: "battle-fleet-column"},
            units
          )
        );
      }
    });
  }
}