/// <reference path="fleetcolumn.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Fleet = React.createClass(
    {
      render: function()
      {
        var fleet = this.props.fleet;

        var columns = [];

        for (var i = 0; i < fleet.length; i++)
        {
          columns.push(UIComponents.FleetColumn(
          {
            key: i,
            column: fleet[i],
            facesLeft: this.props.facesLeft
          }));
        }

        return(
          React.DOM.div({className: "battle-fleet"},
            columns
          )
        );
      }
    });
  }
}