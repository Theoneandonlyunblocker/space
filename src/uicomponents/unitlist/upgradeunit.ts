/// <reference path="abilitylist.ts" />

module Rance
{
  export module UIComponents
  {
    export var UpgradeUnit = React.createClass(
    {
      displayName: "UpgradeUnit",
      getInitialState: function()
      {
        return(
        {
          upgradeData: this.props.unit.getAbilityUpgradeData()
        });
      },
      
      handleClick: function(ability: Templates.IAbilityBase)
      {
        console.log(this.state.upgradeData[ability.type]);
      },
      render: function()
      {
        var unit: Unit = this.props.unit;
        var upgradableAbilities: Templates.IAbilityBase[] = [];

        for (var source in this.state.upgradeData)
        {
          if (this.state.upgradeData[source].base)
          {
            upgradableAbilities.push(this.state.upgradeData[source].base);
          }
          else
          {
            upgradableAbilities.push(
            {
              type: source,
              displayName: "** New ability **",
              description: ""
            });
          }
        }

        return(
          React.DOM.div(
          {
            className: "upgrade-unit"
          },
            React.DOM.div(
            {
              className: "upgrade-unit-header"
            },
              unit.name + "  " + "Level " + unit.level + " -> " + (unit.level + 1)
            ),
            UIComponents.AbilityList(
            {
              abilities: upgradableAbilities,
              handleClick: this.handleClick
            })
          )
        );
      }
    })
  }
}
