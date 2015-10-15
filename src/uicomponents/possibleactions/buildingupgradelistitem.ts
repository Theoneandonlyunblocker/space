/// <reference path="../../player.ts" />
/// <reference path="../mixins/updatewhenmoneychanges.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildingUpgradeListItem = React.createClass(
    {
      displayName: "BuildingUpgradeListItem",
      mixins: [UpdateWhenMoneyChanges],
      propTypes:
      {
        player: React.PropTypes.instanceOf(Player).isRequired,
        handleUpgrade: React.PropTypes.func.isRequired,
        upgradeData: React.PropTypes.object.isRequired
      },

      getInitialState: function()
      {
        return(
        {
          canAfford: this.props.player.money >= this.props.upgradeData.cost
        });
      },
      
      overrideHandleMoneyChange: function()
      {
        this.setState(
        {
          canAfford: this.props.player.money >= this.props.upgradeData.cost
        })
      },

      handleClick: function()
      {
        this.props.handleUpgrade(this.props.upgradeData);
      },

      render: function()
      {
        var upgradeData: IBuildingUpgradeData = this.props.upgradeData;

        var rowProps: any =
        {
          key: upgradeData.template.type,
          className: "building-upgrade-list-item",
          onClick: this.handleClick
        };

        var costProps: any = 
        {
          key: "cost",
          className: "building-upgrade-list-item-cost"
        };

        if (!this.state.canAfford)
        {
          rowProps.onClick = null;
          rowProps.disabled = true;
          rowProps.className += " disabled";

          costProps.className += " negative";
        }

        return(
          React.DOM.tr(rowProps,
            React.DOM.td(
            {
              key: "name",
              className: "building-upgrade-list-item-name"
            }, upgradeData.template.displayName + " " + (upgradeData.level > 1 ? upgradeData.level : "")),
            React.DOM.td(costProps, upgradeData.cost)
          )
        );
      }
    })
  }
}
