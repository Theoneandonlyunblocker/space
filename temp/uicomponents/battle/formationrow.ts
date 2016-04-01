/// <reference path="../../unit.ts" />
/// <reference path="../../battle.ts" />

/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>

/// <reference path="../unit/unitwrapper.ts"/>

export interface PropTypes
{
  row: Unit[];
  rowIndexInOwnFormation: number;
  battle?: Battle;
  facesLeft: boolean;
  activeUnit?: Unit;
  activeTargets?: reactTypeTODO_object; // {[id: number]: Templates.IAbilityTemplate[];}

  hoveredUnit?: Unit;
  hoveredAbility?: reactTypeTODO_object; // Templates.IAbilityTemplate

  handleMouseLeaveUnit?: reactTypeTODO_func;
  handleMouseEnterUnit?: reactTypeTODO_func;
  targetsInPotentialArea?: Unit[];
  activeEffectUnits?: Unit[];
  onMouseUp?: reactTypeTODO_func;
  onUnitClick?: reactTypeTODO_func;
  isDraggable?: boolean;
  onDragStart?: reactTypeTODO_func;
  onDragEnd?: reactTypeTODO_func;
}

export default class FormationRow extends React.Component<PropTypes, {}>
{
  displayName: string = "FormationRow";


  render()
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
}
