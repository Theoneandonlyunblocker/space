import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Unit} from "core/src/unit/Unit";
import {CombatAbilityTemplate} from "core/src/templateinterfaces/CombatAbilityTemplate";


export interface PropTypes extends React.Props<any>
{
  parentElement: HTMLElement;
  facesLeft: boolean;
  activeTargets: {[unitId: number]: CombatAbilityTemplate[]};
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleAbilityUse: (ability: CombatAbilityTemplate, target: Unit) => void;
  targetUnit: Unit;
  handleMouseEnterAbility: (ability: CombatAbilityTemplate) => void;
  handleMouseLeaveAbility: () => void;
}

interface StateType
{
}

export class AbilityTooltipComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AbilityTooltip";
  public readonly ownDOMNode = React.createRef<HTMLDivElement>();

  shouldComponentUpdate(newProps: PropTypes)
  {
    for (const prop in newProps)
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
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const abilities = this.props.activeTargets[this.props.targetUnit.id];

    const abilityElements: React.ReactHTMLElement<HTMLDivElement>[] = [];

    const containerProps: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
    {
      className: "ability-tooltip",
      onMouseLeave: this.props.handleMouseLeave,
      ref: this.ownDOMNode,
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
      const data: React.HTMLAttributes<HTMLDivElement> & React.Attributes = {};

      data.className = "ability-tooltip-ability";
      data.key = ability.key;
      data.onClick = this.props.handleAbilityUse.bind(null, ability, this.props.targetUnit);

      data.onMouseEnter = this.props.handleMouseEnterAbility.bind(null, ability);
      data.onMouseLeave = this.props.handleMouseLeaveAbility;

      if (ability.description)
      {
        data.title = ability.description;
      }

      abilityElements.push(
        ReactDOMElements.div(data,
          ability.displayName,
        ),
      );
    }


    return(
      ReactDOMElements.div(containerProps,
        abilityElements,
      )
    );
  }
}

export const AbilityTooltip: React.Factory<PropTypes> = React.createFactory(AbilityTooltipComponent);
