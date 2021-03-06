import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AbilityBase} from "core/src/templateinterfaces/AbilityBase";

import {AbilityListItem, AbilityListItemType} from "./AbilityListItem";


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
  public displayName = "AbilityList";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const abilities: AbilityBase[] = this.props.abilities;

    const abilityElements: React.ReactElement<any>[] = [];
    const addedAbilityTypes:
    {
      [abilityType: string]: number;
    } = {};

    abilities.sort((_a, _b) =>
    {
      if (_a.use && !_b.use) { return -1; }
      else if (_b.use && !_a.use) { return 1; }

      if (_a.key === "learnable") { return 1; }
      else if (_b.key === "learnable") { return -1; }

      const a = _a.displayName.toLowerCase();
      const b = _b.displayName.toLowerCase();

      if (a > b) { return 1; }
      else if (a < b) { return -1; }
      else { return 0; }
    });

    for (let i = 0; i < abilities.length; i++)
    {
      const ability = abilities[i];
      if (ability.isHidden)
      {
        continue;
      }
      if (!addedAbilityTypes[ability.key])
      {
        addedAbilityTypes[ability.key] = 0;
      }


      abilityElements.push(
        AbilityListItem(
        {
          key: ability.key + addedAbilityTypes[ability.key],
          type: this.getAbilityListItemType(ability, addedAbilityTypes[ability.key]),
          displayName: ability.displayName,
          title: ability.description,

          onClick: (this.props.handleClick ? this.props.handleClick.bind(null, ability) : undefined)
        }),
      );

      addedAbilityTypes[ability.key]++;
    }

    return(
      ReactDOMElements.ol(
      {
        className: "ability-list",
      },
        abilityElements,
        this.props.children,
      )
    );
  }

  private getAbilityListItemType(ability: AbilityBase, addedAbilitiesOfType: number): AbilityListItemType
  {
    if (addedAbilitiesOfType > 0)
    {
      return "redundant";
    }
    else if (!ability.use)
    {
      return "passive";
    }
    else
    {
      return "active";
    }
  }
}

export const AbilityList: React.Factory<PropTypes> = React.createFactory(AbilityListComponent);
