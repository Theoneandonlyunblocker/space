/// <reference path="../../unit.ts" />
/// <reference path="../../battle.ts" />

/// <reference path="fleetrow.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Fleet = React.createClass(
    {
      displayName: "Fleet",

      propTypes:
      {
        fleet: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit))).isRequired,
        battle: React.PropTypes.instanceOf(Rance.Battle),
        facesLeft: React.PropTypes.bool.isRequired,
        activeUnit: React.PropTypes.instanceOf(Rance.Unit),
        activeTargets: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit)),
        hoveredUnit: React.PropTypes.instanceOf(Rance.Unit),
        hoveredAbility: React.PropTypes.object, // Templates.IAbilityTemplate
        handleMouseLeaveUnit: React.PropTypes.func,
        handleMouseEnterUnit: React.PropTypes.func,
        targetsInPotentialArea: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit)),
        activeEffectUnits: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit)),
        onMouseUp: React.PropTypes.func,
        onUnitClick: React.PropTypes.func,
        isDraggable: React.PropTypes.bool,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func
      },

      render: function()
      {
        var fleet = this.props.fleet;

        var fleetRows: ReactComponentPlaceHolder[] = [];

        for (var i = 0; i < fleet.length; i++)
        {
          fleetRows.push(UIComponents.FleetRow(
          {
            key: i,
            row: fleet[i],
            rowIndexInOwnFleet: i,
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
            fleetRows
          )
        );
      }
    });
  }
}