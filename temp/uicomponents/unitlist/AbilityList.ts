/// <reference path="../../../lib/react-0.13.3.d.ts" />


import AbilityBase from "../../../src/templateinterfaces/AbilityBase.d.ts";

import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  handleClick: any; // TODO refactor | define prop type 123
  abilities: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class AbilityList_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "AbilityList";
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
    var abilities: AbilityBase[] = this.props.abilities;
    var baseClassName = "unit-info-ability";

    if (abilities.length < 1) return null;


    var abilityElements: React.HTMLElement[] = [];
    var addedAbilityTypes:
    {
      [abilityType: string]: number;
    } = {};

    abilities.sort(function(_a, _b)
    {
      if (_a.mainEffect && !_b.mainEffect) return -1;
      else if (_b.mainEffect && !_a.mainEffect) return 1;

      if (_a.type === "learnable") return 1;
      else if (_b.type === "learnable") return -1;

      var a = _a.displayName.toLowerCase();
      var b = _b.displayName.toLowerCase();
      
      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });

    for (var i = 0; i < abilities.length; i++)
    {
      var ability = abilities[i];
      if (ability.isHidden)
      {
        continue;
      }
      if (!addedAbilityTypes[ability.type])
      {
        addedAbilityTypes[ability.type] = 0;
      }

      var className = "unit-info-ability";
      var isPassiveSkill = !ability.mainEffect;
      if (isPassiveSkill)
      {
        className += " passive-skill";
      }
      else
      {
        className += " active-skill";
      }

      if (addedAbilityTypes[ability.type] >= 1)
      {
        className += " redundant-ability";
      }

      abilityElements.push(
        React.DOM.li(
        {
          className: className,
          title: ability.description,
          key: ability.type + addedAbilityTypes[ability.type],
          onClick: (this.props.handleClick ? this.props.handleClick.bind(null, ability) : undefined)
        },
          "[" + ability.displayName + "]"
        )
      );

      addedAbilityTypes[ability.type]++;
    }

    return(
      React.DOM.ul(
      {
        className: "ability-list"
      },
        abilityElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AbilityList_COMPONENT_TODO);
export default Factory;
