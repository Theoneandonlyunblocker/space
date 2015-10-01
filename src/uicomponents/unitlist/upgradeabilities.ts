/// <reference path="abilitylist.ts" />

module Rance
{
  export module UIComponents
  {
    export var UpgradeAbilities = React.createClass(
    {
      displayName: "UpgradeAbilities",
      render: function()
      {
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
    })
  }
}
