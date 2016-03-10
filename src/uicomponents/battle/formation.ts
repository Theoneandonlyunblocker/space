/// <reference path="../../unit.ts" />
/// <reference path="../../battle.ts" />

/// <reference path="formationrow.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Formation = React.createClass(
    {
      displayName: "Formation",

      propTypes:
      {
        formation: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit))).isRequired,
        battle: React.PropTypes.instanceOf(Rance.Battle),
        facesLeft: React.PropTypes.bool.isRequired,
        activeUnit: React.PropTypes.instanceOf(Rance.Unit),
        activeTargets: React.PropTypes.object, // {[id: number]: Templates.IAbilityTemplate[];}
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
        var formation = this.props.formation;

        var formationRows: ReactComponentPlaceHolder[] = [];

        for (var i = 0; i < formation.length; i++)
        {
          formationRows.push(UIComponents.FormationRow(
          {
            key: i,
            row: formation[i],
            rowIndexInOwnFormation: i,
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
          React.DOM.div({className: "battle-formation"},
            formationRows
          )
        );
      }
    });
  }
}