/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class AbilityTooltip extends React.Component<PropTypes, {}>
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
  render()
  {
    var abilities = this.props.activeTargets[this.props.targetUnit.id];

    var abilityElements: ReactComponentPlaceHolder[] = [];

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
