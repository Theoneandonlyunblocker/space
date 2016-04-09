/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="abilitylist.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class UpgradeAbilities extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeAbilities";
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
        UIComponents.AbilityList(
        {
          abilities: this.props.abilities,
          handleClick: this.props.handleClick
        })
      )
    );
  }
}
