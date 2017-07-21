import * as React from "react";

import Unit from "../../Unit";
import AbilityTemplate from "../../templateinterfaces/AbilityTemplate";

export interface PropTypes extends React.Props<any>
{
  parentElement: HTMLElement;
  facesLeft: boolean;
  activeTargets: {[unitId: number]: AbilityTemplate[]};
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleAbilityUse: (ability: AbilityTemplate, target: Unit) => void;
  targetUnit: Unit;
  handleMouseEnterAbility: (ability: AbilityTemplate) => void;
  handleMouseLeaveAbility: () => void;
}

interface StateType
{
}

export class AbilityTooltipComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "AbilityTooltip";

  shouldComponentUpdate(newProps: PropTypes)
  {
    for (let prop in newProps)
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
  }

  render()
  {
    const abilities = this.props.activeTargets[this.props.targetUnit.id];

    const abilityElements: React.ReactElement<any>[] = [];

    const containerProps: any =
    {
      className: "ability-tooltip",
      onMouseLeave: this.props.handleMouseLeave,
    };

    const parentRect = this.props.parentElement.getBoundingClientRect();

    containerProps.style =
    {
      position: "fixed",
      top: parentRect.top,
    };

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

    for (let i = 0; i < abilities.length; i++)
    {
      const ability = abilities[i];
      const data: any = {};

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
          ability.displayName,
        ),
      );
    }


    return(
      React.DOM.div(containerProps,
        abilityElements,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AbilityTooltipComponent);
export default Factory;
