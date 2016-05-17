/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App";
import Unit from "../../Unit";
import UnitWrapper from "../unit/UnitWrapper";
import UnitDisplayData from "../../UnitDisplayData";
import EmptyUnit from "../unit/EmptyUnit";
import
{
  default as UnitComponentFactory,
  PropTypes as UnitPropTypes,
  ComponentPropTypes as UnitComponentPropTypes,
  DisplayStatus as UnitDisplayStatus
} from "../unit/Unit";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";
import {shallowExtend} from "../../utility";


export interface PropTypes extends React.Props<any>
{
  formation: Unit[][];
  facesLeft: boolean;
  unitStrengthAnimateDuration: number;
  unitDisplayDataByID:
  {
    [unitID: number]: UnitDisplayData;
  };
  
  onMouseUp?: (position: number[]) => void;
  
  onUnitClick?: (unit: Unit) => void;
  handleMouseLeaveUnit?: (e: React.MouseEvent) => void;
  handleMouseEnterUnit?: (unit: Unit) => void;
  
  isDraggable?: boolean;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  
  isInBattlePrep?: boolean;
  hoveredUnit?: Unit;
  activeUnit?: Unit;
  targetsInPotentialArea?: Unit[];
  activeEffectUnits?: Unit[];
  hoveredAbility?: AbilityTemplate;
  capturedUnits?: Unit[];
  destroyedUnits?: Unit[];

  
  // onMouseUp?: (position: number[]) => void;
}

interface StateType
{
}

export class FormationComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Formation";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  private makeBoundFunction(functionToBind: Function, valueToBind: any): () => void
  {
    if (!functionToBind)
    {
      return null;
    }
    else
    {
      return(
        () => {functionToBind(valueToBind)}
      );
    }
  }
  
  private unitInArray(unitToCheck: Unit, arr: Unit[]): boolean
  {
    if (!arr)
    {
      return false;
    }
    else
    {
      return arr.some(unit => unit === unitToCheck);
    }
  }
  
  render()
  {
    var formationRowElements: React.ReactHTMLElement<HTMLDivElement>[] = [];

    for (let i = 0; i < this.props.formation.length; i++)
    {
      const absoluteRowIndex = this.props.facesLeft ?
        i + app.moduleData.ruleSet.battle.rowsPerFormation :
        i;
      const unitElements: React.ReactElement<any>[] = [];
      for (let j = 0; j < this.props.formation[i].length; j++)
      {
        const unit = this.props.formation[i][j];
        
        const absolutePosition = [absoluteRowIndex, j];
        const onMouseUp = this.props.onMouseUp ?
          this.props.onMouseUp.bind(null, absolutePosition) :
          null;
          
        let unitProps: UnitPropTypes;
        
        if (unit)
        {
          
          const unitDisplayData = this.props.unitDisplayDataByID[unit.id];
          const componentProps: UnitComponentPropTypes =
          {
            id: unit.id,
            onUnitClick: this.makeBoundFunction(this.props.onUnitClick, unit),
            handleMouseEnterUnit: this.makeBoundFunction(this.props.handleMouseEnterUnit, unit),
            handleMouseLeaveUnit: this.props.handleMouseLeaveUnit,
            isDraggable: this.props.isDraggable,
            onDragStart: this.makeBoundFunction(this.props.onDragStart, unit),
            onDragEnd: this.props.onDragEnd,
            onMouseUp: onMouseUp,
            animateDuration: this.props.unitStrengthAnimateDuration
          }
          const displayProps: UnitDisplayStatus =
          {
            wasDestroyed: this.unitInArray(unit, this.props.destroyedUnits),
            wasCaptured: this.unitInArray(unit, this.props.capturedUnits),
            
            isInBattlePrep: this.props.isInBattlePrep,
            isActiveUnit: this.props.activeUnit === unit,
            isHovered: this.props.hoveredUnit === unit,
            isInPotentialTargetArea: this.unitInArray(unit, this.props.targetsInPotentialArea),
            isTargetOfActiveEffect: this.unitInArray(unit, this.props.activeEffectUnits),
            hoveredActionPointExpenditure: this.props.hoveredAbility &&
              this.props.activeUnit === unit ? this.props.hoveredAbility.actionsUse : null,
          }
          
          unitProps = shallowExtend(unitDisplayData, componentProps, displayProps);
        }
        
        unitElements.push(
          UnitWrapper({key: ("unit_wrapper_" + i) + j},
            EmptyUnit(
            {
              facesLeft: this.props.facesLeft,
              onMouseUp: onMouseUp
            }),
            !unit ? null : UnitComponentFactory(
              unitProps
            )
          )
        );
      }
      
      formationRowElements.push(React.DOM.div(
      {
        className: "battle-formation-row",
        key: "row_" + i
      },
        unitElements
      ))
    }

    return(
      React.DOM.div({className: "battle-formation"},
        formationRowElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FormationComponent);
export default Factory;
