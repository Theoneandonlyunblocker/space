/// <reference path="fleetcolumn.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Fleet = React.createClass(
    {
      displayName: "Fleet",

      render: function()
      {
        var fleet = this.props.fleet;

        var columns: ReactComponentPlaceHolder[] = [];

        for (var i = 0; i < fleet.length; i++)
        {
          columns.push(UIComponents.FleetColumn(
          {
            key: i,
            column: fleet[i],
            columnPosInOwnFleet: i,
            battle: this.props.battle,
            facesLeft: this.props.facesLeft,
            activeUnit: this.props.activeUnit,
            hoveredUnit: this.props.hoveredUnit,
            hoveredAbility: this.props.hoveredAbility,
            handleMouseEnterUnit: this.props.handleMouseEnterUnit,
            handleMouseLeaveUnit: this.props.handleMouseLeaveUnit,
            targetsInPotentialArea: this.props.targetsInPotentialArea,
            activeEffectUnits: this.props.activeEffectUnits,

            onMouseUp: this.props.onMouseUp,
            onUnitClick: this.props.onUnitClick,

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