/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  parentElement: any; // TODO refactor | define prop type 123
  facesLeft: any; // TODO refactor | define prop type 123
  activeTargets: any; // TODO refactor | define prop type 123
  handleMouseLeave: any; // TODO refactor | define prop type 123
  handleAbilityUse: any; // TODO refactor | define prop type 123
  targetUnit: any; // TODO refactor | define prop type 123
  handleMouseEnterAbility: any; // TODO refactor | define prop type 123
  handleMouseLeaveAbility: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class AbilityTooltip_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "AbilityTooltip";

  shouldComponentUpdate(newProps: any)
  {
    for (var prop in newProps)
    {
      if (prop !== "activeTargets")
      {
        if (this.props[prop] !== newProps[prop])
        {
          return true;
        }
      }
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
  
  render()
  {
    var abilities = this.props.activeTargets[this.props.targetUnit.id];

    var abilityElements: React.ReactElement<any>[] = [];

    var containerProps: any =
    {
      className: "ability-tooltip",
      onMouseLeave: this.props.handleMouseLeave
    };

    var parentRect = this.props.parentElement.getBoundingClientRect();

    containerProps.style =
    {
      position: "fixed",
      top: parentRect.top
    }

    if (this.props.facesLeft)
    {
      containerProps.className += " ability-tooltip-faces-left";
      containerProps.style.left = parentRect.left;
    }
    else
    {
      containerProps.className += " ability-tooltip-faces-right";
      // aligning right to right doesnt work for some reason
      containerProps.style.left = parentRect.right - 128;
    }

    for (var i = 0; i < abilities.length; i++)
    {
      var ability = abilities[i];
      var data: any = {};

      data.className = "ability-tooltip-ability";
      data.key = i;
      data.onClick = this.props.handleAbilityUse.bind(null, ability, this.props.targetUnit);

      data.onMouseEnter = this.props.handleMouseEnterAbility.bind(null, ability);
      data.onMouseLeave = this.props.handleMouseLeaveAbility;

      if (ability.description)
      {
        data.title = ability.description;
      }

      abilityElements.push(
        React.DOM.div(data,
          ability.displayName
        )
      );
    }


    return(
      React.DOM.div(containerProps,
        abilityElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AbilityTooltip_COMPONENT_TODO);
export default Factory;
