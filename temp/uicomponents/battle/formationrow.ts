/// <reference path="../../unit.ts" />
/// <reference path="../../battle.ts" />

/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>

/// <reference path="../unit/unitwrapper.ts"/>

export var FormationRow = React.createFactory(React.createClass(
{
  displayName: "FormationRow",

  propTypes:
  {
    row: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Rance.Unit)).isRequired,
    rowIndexInOwnFormation: React.PropTypes.number.isRequired,
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
    var row: Unit[] = this.props.row;

    var side: UnitBattleSide = this.props.facesLeft ? "side2" : "side1";
    var absoluteRowIndex = side === "side1" ?
      this.props.rowIndexInOwnFormation :
      this.props.rowIndexInOwnFormation + app.moduleData.ruleSet.battle.rowsPerFormation;

    var units: ReactComponentPlaceHolder[] = [];

    for (var i = 0; i < row.length; i++)
    {
      var data: any = {};

      data.key = i;
      data.unit = row[i];
      data.position = [absoluteRowIndex, i];
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
      React.DOM.div({className: "battle-formation-row"},
        units
      )
    );
  }
}));
