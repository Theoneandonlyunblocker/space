/// <reference path="fleetcolumn.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Fleet = React.createClass(
    {
      displayName: "Fleet",

      shouldComponentUpdate: function(newProps: any)
      {
        for (var prop in newProps)
        {
          if (newProps[prop] !== this.props[prop]) return true;
        }

        var oldFleet = this.props.fleet;
        var newFleet = newProps.fleet;

        for (var i = 0; i < oldFleet.length; i++)
        {
          for (var j = 0; j < oldFleet[i].length; j++)
          {
            if (oldFleet[i][j] !== newFleet[i][j])
            {
              console.log("updatefleet");
              return true;
            }
          }
        }

        return false;
      },

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
            columnPosInOwnFleet: i,
            facesLeft: this.props.facesLeft,
            activeUnit: this.props.activeUnit,
            hoveredUnit: this.props.hoveredUnit,
            handleMouseEnterUnit: this.props.handleMouseEnterUnit,
            handleMouseLeaveUnit: this.props.handleMouseLeaveUnit,
            targetsInPotentialArea: this.props.targetsInPotentialArea,

            onMouseUp: this.props.onMouseUp,

            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd
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