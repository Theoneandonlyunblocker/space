import * as React from "react";


import AbilityBase from "../../templateinterfaces/AbilityBase";


export interface PropTypes extends React.Props<any>
{
  handleClick?: (ability: AbilityBase) => void;
  abilities: AbilityBase[];
}

interface StateType
{
}

export class AbilityListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "AbilityList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const abilities: AbilityBase[] = this.props.abilities;

    if (abilities.length < 1)
    {
      return null;
    }


    const abilityElements: React.ReactHTMLElement<any>[] = [];
    const addedAbilityTypes:
    {
      [abilityType: string]: number;
    } = {};

    abilities.sort(function(_a, _b)
    {
      if (_a.mainEffect && !_b.mainEffect) return -1;
      else if (_b.mainEffect && !_a.mainEffect) return 1;

      if (_a.type === "learnable") return 1;
      else if (_b.type === "learnable") return -1;

      const a = _a.displayName.toLowerCase();
      const b = _b.displayName.toLowerCase();

      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });

    for (let i = 0; i < abilities.length; i++)
    {
      const ability = abilities[i];
      if (ability.isHidden)
      {
        continue;
      }
      if (!addedAbilityTypes[ability.type])
      {
        addedAbilityTypes[ability.type] = 0;
      }

      let className = "unit-info-ability";
      const isLearnable = ability.type === "learnable";
      if (isLearnable)
      {
        className += " learnable-ability";
      }
      else
      {
        const isPassiveSkill = !ability.mainEffect;
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
      }


      abilityElements.push(
        React.DOM.li(
        {
          className: className,
          title: ability.description,
          key: ability.type + addedAbilityTypes[ability.type],
          onClick: (this.props.handleClick ? this.props.handleClick.bind(null, ability) : undefined),
        },
          "[" + ability.displayName + "]",
        ),
      );

      addedAbilityTypes[ability.type]++;
    }

    return(
      React.DOM.ul(
      {
        className: "ability-list",
      },
        abilityElements,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(AbilityListComponent);
export default Factory;
