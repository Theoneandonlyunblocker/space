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
  ComponentPropTypes as UnitComponentPropTypes
} from "../unit/Unit";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";
import {extendObject} from "../../utility";


interface PropTypes extends React.Props<any>
{
  formation: Unit[][];
  facesLeft: boolean;
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
  
  // battle?: Battle;
  // activeUnit?: Unit;

  // hoveredUnit?: Unit;
  // hoveredAbility?: AbilityTemplate;

  // targetsInPotentialArea?: Unit[];
  // activeEffectUnits?: Unit[];
  
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
        const absolutePosition = [absoluteRowIndex, j];
        const unit = this.props.formation[i][j];
        
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
          }
          
          unitProps = extendObject(unitDisplayData, componentProps);
        }
        
        unitElements.push(
          UnitWrapper({key: ("unit_wrapper_" + i) + j},
            EmptyUnit(
            {
              facesLeft: this.props.facesLeft,
              onMouseUp: this.props.onMouseUp ?
                this.props.onMouseUp.bind(null, absolutePosition) :
                null
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
