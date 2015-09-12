/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>

/// <reference path="../unit/unitwrapper.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetColumn = React.createClass(
    {
      displayName: "FleetColumn",
      render: function()
      {
        var column = this.props.column;

        var absoluteColumnPosition = this.props.columnPosInOwnFleet + (this.props.facesLeft ? 2 : 0);

        var units: ReactComponentPlaceHolder[] = [];

        for (var i = 0; i < column.length; i++)
        {
          var data: any = {};

          data.key = i;
          data.unit = column[i];
          data.position = [absoluteColumnPosition, i];
          data.battle = this.props.battle;
          data.facesLeft = this.props.facesLeft;
          data.activeUnit = this.props.activeUnit;
          data.activeTargets = this.props.activeTargets;
          data.hoveredUnit = this.props.hoveredUnit;
          data.hoveredAbility = this.props.hoveredAbility;
          data.handleMouseLeaveUnit = this.props.handleMouseLeaveUnit;
          data.handleMouseEnterUnit = this.props.handleMouseEnterUnit;
          data.targetsInPotentialArea = this.props.targetsInPotentialArea;
          data.activeEffectUnits = this.props.activeEffectUnits;

          data.onMouseUp = this.props.onMouseUp;
          data.onUnitClick = this.props.onUnitClick;

          data.isDraggable = this.props.isDraggable;
          data.onDragStart = this.props.onDragStart;
          data.onDragEnd = this.props.onDragEnd;

          units.push(UIComponents.UnitWrapper(data));
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