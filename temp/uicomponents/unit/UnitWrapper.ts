/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/droptarget.ts"/>

/// <reference path="uniticon.ts"/>


import EmptyUnit from "./EmptyUnit.ts";
import Unit from "./Unit.ts";


export interface PropTypes extends React.Props<any>
{
  isCaptured: any; // TODO refactor | define prop type 123
  onMouseUp: any; // TODO refactor | define prop type 123
  facesLeft: any; // TODO refactor | define prop type 123
  isDead: any; // TODO refactor | define prop type 123
  position: any; // TODO refactor | define prop type 123
  battle: any; // TODO refactor | define prop type 123
  unit: any; // TODO refactor | define prop type 123
  activeEffectUnits: any; // TODO refactor | define prop type 123
  key: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class UnitWrapper_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitWrapper";
  mixins: reactTypeTODO_any = [DropTarget];
  shouldComponentUpdate(newProps: any)
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


    for (var prop in newProps)
    {
      if (!targetedProps[prop] && prop !== "position")
      {
        if (newProps[prop] !== this.props[prop])
        {
          return true;
        }
      }
    }
    for (var prop in targetedProps)
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
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleMouseUp()
  {
    console.log("unitMouseUp", this.props.position);
    this.props.onMouseUp(this.props.position);
  }

  render()
  {
    var allElements: React.ReactElement<any>[] = [];

    var wrapperProps: any =
    {
      className: "unit-wrapper drop-target"
    };

    if (this.props.onMouseUp)
    {
      wrapperProps.onMouseUp = wrapperProps.onTouchEnd = this.handleMouseUp
    };
    if (this.props.activeEffectUnits)
    {
      if (this.props.activeEffectUnits.indexOf(this.props.unit) >= 0)
      {
        wrapperProps.className += " active-effect-unit";
      }
    }

    var empty = EmptyUnit(
    {
      facesLeft: this.props.facesLeft,
      key: "empty",
      position: this.props.position
    });

    allElements.push(empty);

    if (this.props.unit)
    {

      var isDead = false;
      if (this.props.battle &&
        this.props.battle.deadUnits && this.props.battle.deadUnits.length > 0)
      {
        if (this.props.battle.deadUnits.indexOf(this.props.unit) >= 0)
        {
          this.props.isDead = true;
        }
      }

      var isCaptured = false;
      if (this.props.battle &&
        this.props.battle.capturedUnits && this.props.battle.capturedUnits.length > 0)
      {
        if (this.props.battle.capturedUnits.indexOf(this.props.unit) >= 0)
        {
          this.props.isCaptured = true;
        }
      }

      this.props.key = "unit";
      var unit = Unit(this.props);
      allElements.push(unit);
    }
    
    return(
      React.DOM.div(wrapperProps,
        allElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitWrapper_COMPONENT_TODO);
export default Factory;
