/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="abilitylist.ts" />


import AbilityList from "./AbilityList.ts";


export interface PropTypes extends React.Props<any>
{
  sourceAbility: any; // TODO refactor | define prop type 123
  handleClick: any; // TODO refactor | define prop type 123
  abilities: any; // TODO refactor | define prop type 123
  learningNewability: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class UpgradeAbilities_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeAbilities";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    if (this.props.abilities.length === 0)
    {
      return null;
    }
    
    var headerText: string;
    if (this.props.learningNewability)
    {
      headerText = "Learn ability";
    }
    else
    {
      headerText = "Upgrade ability";
      if (this.props.sourceAbility)
      {
        headerText += " " + this.props.sourceAbility.displayName;
      }
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-abilities"
      },
        React.DOM.div(
        {
          className: "upgrade-abilities-header"
        },
          headerText
        ),
        AbilityList(
        {
          abilities: this.props.abilities,
          handleClick: this.props.handleClick
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeAbilities_COMPONENT_TODO);
export default Factory;
