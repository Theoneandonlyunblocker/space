/// <reference path="../../../lib/react-global.d.ts" />


import Unit from "../../Unit";
import FormationRow from "./FormationRow";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";


interface PropTypes extends React.Props<any>
{
  formation: Unit[][];
  battle?: Battle;
  facesLeft: boolean;
  activeUnit?: Unit;

  hoveredUnit?: Unit;
  hoveredAbility?: AbilityTemplate;

  targetsInPotentialArea?: Unit[];
  activeEffectUnits?: Unit[];
  isDraggable?: boolean;
  
  onUnitClick?: (unit: Unit) => void;
  onMouseUp?: (position: number[]) => void;
  handleMouseLeaveUnit?: (e: React.MouseEvent) => void;
  handleMouseEnterUnit?: (unit: Unit) => void;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
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
  
  render()
  {
    var formation = this.props.formation;

    var formationRows: React.ReactElement<any>[] = [];

    for (let i = 0; i < formation.length; i++)
    {
      formationRows.push(FormationRow(
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(FormationComponent);
export default Factory;
