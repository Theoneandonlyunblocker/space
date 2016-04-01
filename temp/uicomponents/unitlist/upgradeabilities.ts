/// <reference path="abilitylist.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UpgradeAbilities extends React.Component<PropTypes, Empty>
{
  displayName: "UpgradeAbilities",
  render: function()
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
