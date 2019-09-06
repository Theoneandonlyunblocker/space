import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AbilityTargetDisplayDataById} from "src/abilities/AbilityTargetDisplayData";
import {Unit as UnitObj} from "src/unit/Unit";
import {UnitDisplayData} from "src/unit/UnitDisplayData";
import {activeModuleData} from "src/app/activeModuleData";
import {AbilityTemplate} from "src/templateinterfaces/AbilityTemplate";
import {shallowExtend} from "src/generic/utility";
import {EmptyUnit} from "../unit/EmptyUnit";
import
{
  ComponentPropTypes as UnitComponentPropTypes,
  Unit,
  DisplayStatus as UnitDisplayStatus,
  PropTypes as UnitPropTypes,
} from "../unit/Unit";
import {UnitWrapper} from "../unit/UnitWrapper";


// tslint:disable-next-line:ban-types
function bindFunctionIfExists(functionToBind: Function | undefined, valueToBind: any): (() => void) | null
{
  if (!functionToBind)
  {
    return null;
  }
  else
  {
    return(
      () => {functionToBind(valueToBind);}
    );
  }
}

export interface PropTypes extends React.Props<any>
{
  formation: UnitObj[][];
  facesLeft: boolean;
  unitStrengthAnimateDuration: number | undefined;
  unitDisplayDataById:
  {
    [unitId: number]: UnitDisplayData;
  };

  onMouseUp?: (position: number[]) => void;

  onUnitClick?: (unit: UnitObj) => void;
  handleMouseLeaveUnit?: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseEnterUnit?: (unit: UnitObj) => void;

  isDraggable?: boolean;
  onDragStart?: (unit: UnitObj) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;

  isInBattlePrep?: boolean;
  hoveredUnit: UnitObj | null;
  activeUnit: UnitObj | null;
  abilityTargetDisplayDataById: AbilityTargetDisplayDataById;
  activeEffectUnits?: UnitObj[];
  hoveredAbility?: AbilityTemplate;
  capturedUnits?: UnitObj[];
  destroyedUnits?: UnitObj[];
}

interface StateType
{
}

export class FormationComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Formation";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const formationRowElements: React.ReactHTMLElement<HTMLDivElement>[] = [];

    for (let i = 0; i < this.props.formation.length; i++)
    {
      const absoluteRowIndex = this.props.facesLeft ?
        i + activeModuleData.ruleSet.battle.rowsPerFormation :
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

          const unitDisplayData = this.props.unitDisplayDataById[unit.id];
          const componentProps: UnitComponentPropTypes =
          {
            id: unit.id,
            onUnitClick: bindFunctionIfExists(this.props.onUnitClick, unit),
            handleMouseEnterUnit: bindFunctionIfExists(this.props.handleMouseEnterUnit, unit),
            handleMouseLeaveUnit: this.props.handleMouseLeaveUnit,
            isDraggable: this.props.isDraggable,
            onDragStart: bindFunctionIfExists(this.props.onDragStart, unit),
            onDragEnd: this.props.onDragEnd,
            onMouseUp: onMouseUp,
            animateDuration: this.props.unitStrengthAnimateDuration,
          };
          const displayProps: UnitDisplayStatus =
          {
            wasDestroyed: this.props.destroyedUnits ? this.props.destroyedUnits.some(toCheck => toCheck === unit) : false,
            wasCaptured: this.props.capturedUnits ? this.props.capturedUnits.some(toCheck => toCheck === unit) : false,

            isInBattlePrep: this.props.isInBattlePrep,
            isActiveUnit: this.props.activeUnit === unit,
            isHovered: this.props.hoveredUnit === unit,
            // TODO 2018.01.28 | pass actual displayData
            isInPotentialTargetArea: this.props.abilityTargetDisplayDataById[unit.id] && Boolean(this.props.abilityTargetDisplayDataById[unit.id].targetType),
            isTargetOfActiveEffect: this.props.activeEffectUnits ? this.props.activeEffectUnits.some(toCheck => toCheck === unit) : false,
            hoveredActionPointExpenditure: this.props.hoveredAbility &&
              this.props.activeUnit === unit ? this.props.hoveredAbility.actionsUse : null,
          };

          unitProps = shallowExtend(unitDisplayData, componentProps, displayProps);
          if (this.props.facesLeft && this.props.isInBattlePrep)
          {
            unitProps.facesLeft = true;
          }
        }

        unitElements.push(
          UnitWrapper(
          {
            key: `unit_wrapper_${i}${j}`,
          },
            EmptyUnit(
            {
              facesLeft: this.props.facesLeft,
              onMouseUp: onMouseUp,
            }),
            !unit ? null : Unit(
              unitProps,
            ),
          ),
        );
      }

      formationRowElements.push(ReactDOMElements.div(
      {
        className: "battle-formation-row",
        key: "row_" + i,
      },
        unitElements,
      ));
    }

    return(
      ReactDOMElements.div({className: "battle-formation"},
        formationRowElements,
      )
    );
  }
}

export const Formation: React.Factory<PropTypes> = React.createFactory(FormationComponent);
