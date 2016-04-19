/// <reference path="../../../lib/react-global.d.ts" />

import EmptyUnit from "./EmptyUnit";
import Unit from "../../Unit";
import UnitComponentFactory from "./Unit";
import Battle from "../../Battle";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";
import {shallowCopy} from "../../utility";

interface PropTypes extends React.Props<any>
{
  isCaptured?: boolean;
  isDead?: boolean;
  position: number[];
  unit: Unit;
  
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
  handleMouseEnterUnit: (unit: Unit) => void;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (dropSuccessful?: boolean) => void;
}

interface StateType
{
}

export class UnitWrapperComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitWrapper";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleMouseUp = this.handleMouseUp.bind(this);    
  }
  
  shouldComponentUpdate(newProps: PropTypes)
  {
    if (!this.props.unit && !newProps.unit) return false;

    if (newProps.unit && newProps.unit.uiDisplayIsDirty) return true;

    var targetedProps =
    {
      activeUnit: true,
      hoveredUnit: true,
      targetsInPotentialArea: true,
      activeEffectUnits: true
    };


    for (let prop in newProps)
    {
      if (!targetedProps[prop] && prop !== "position")
      {
        if (newProps[prop] !== this.props[prop])
        {
          return true;
        }
      }
    }
    for (let prop in targetedProps)
    {
      var unit = newProps.unit;
      var oldValue = this.props[prop];
      var newValue = newProps[prop];

      if (!newValue && !oldValue) continue;

      if (prop === "targetsInPotentialArea" || prop === "activeEffectUnits")
      {
        if (!oldValue)
        {
          if (newValue.indexOf(unit) >= 0) return true;
          else
          {
            continue;
          }
        }
        if ((oldValue.indexOf(unit) >= 0) !==
          (newValue.indexOf(unit) >= 0))
        {
          return true;
        }
      }
      else if (newValue !== oldValue &&
        (oldValue === unit || newValue === unit))
      {
        return true;
      }
    }

    if (newProps.battle && newProps.battle.ended)
    {
      return true;
    }

    return false;
  }
  
  handleMouseUp()
  {
    console.log("unitMouseUp", this.props.position);
    this.props.onMouseUp(this.props.position);
  }

  render()
  {
    var allElements: React.ReactElement<any>[] = [];

    var wrapperProps: React.HTMLAttributes =
    {
      className: "unit-wrapper drop-target"
    };

    if (this.props.onMouseUp)
    {
      wrapperProps.onMouseUp = wrapperProps.onTouchEnd = this.handleMouseUp
    };

    var empty = EmptyUnit(
    {
      facesLeft: this.props.facesLeft,
      key: "empty"
    });

    allElements.push(empty);

    if (this.props.unit)
    {
      const clonedProps = shallowCopy(this.props);
      var isDead = false;
      if (this.props.battle &&
        this.props.battle.deadUnits && this.props.battle.deadUnits.length > 0)
      {
        if (this.props.battle.deadUnits.indexOf(this.props.unit) >= 0)
        {
          clonedProps.isDead = true;
        }
      }

      var isCaptured = false;
      if (this.props.battle &&
        this.props.battle.capturedUnits && this.props.battle.capturedUnits.length > 0)
      {
        if (this.props.battle.capturedUnits.indexOf(this.props.unit) >= 0)
        {
          clonedProps.isCaptured = true;
        }
      }

      clonedProps.key = "unit";
      var unit = UnitComponentFactory(clonedProps);
      allElements.push(unit);
    }
    
    return(
      React.DOM.div(wrapperProps,
        allElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitWrapperComponent);
export default Factory;
