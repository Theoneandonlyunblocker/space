// /// <reference path="buildingupgradelistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildingUpgradeList = React.createClass(
    {
      displayName: "BuildingUpgradeList",

      hasAvailableUpgrades: function()
      {
        var possibleUpgrades = this.props.star.getBuildingUpgrades();
        return Object.keys(possibleUpgrades).length > 0;
      },

      upgradeBuilding: function(upgradeData)
      {
        var star = upgradeData.parentBuilding.location

        console.log(upgradeData);
        var newBuilding = new Building(
        {
          template: upgradeData.template,
          location: star,
          controller: upgradeData.parentBuilding.controller,
          upgradeLevel: upgradeData.level,
          totalCost: upgradeData.parentBuilding.totalCost + upgradeData.cost
        });

        star.removeBuilding(upgradeData.parentBuilding);
        star.addBuilding(newBuilding);

        upgradeData.parentBuilding.controller.money -= upgradeData.cost;

        eventManager.dispatchEvent("playerControlUpdated");

        if (!this.hasAvailableUpgrades())
        {
          this.props.clearExpandedAction();
        }
      },

      render: function()
      {
        if (!this.hasAvailableUpgrades()) return null;

        var possibleUpgrades = this.props.star.getBuildingUpgrades();
        var upgradeGroups = [];

        for (var parentBuildingId in possibleUpgrades)
        {
          var upgrades = possibleUpgrades[parentBuildingId];
          var parentBuilding = upgrades[0].parentBuilding;

          var upgradeElements = [];

          for (var i = 0; i < upgrades.length; i++)
          {
            var upgrade = upgrades[i];

            var rowProps: any =
            {
              key: upgrade.template.type,
              className: "building-upgrade-list-item",
              onClick: this.upgradeBuilding.bind(this, upgrade)
            };

            var costProps: any = 
            {
              key: "cost",
              className: "building-upgrade-list-item-cost"
            };

            if (this.props.player.money < upgrade.cost)
            {
              rowProps.onClick = null;
              rowProps.disabled = true;
              rowProps.className += " disabled";

              costProps.className += " negative";
            }

            upgradeElements.push(
              React.DOM.tr(rowProps,
                React.DOM.td(
                {
                  key: "name",
                  className: "building-upgrade-list-item-name"
                }, upgrade.template.name + " " + upgrade.level),
                React.DOM.td(costProps, upgrade.cost)
              )
            );
          }

          var parentElement = React.DOM.div(
          {
            key: parentBuilding.id,
            className: "building-upgrade-group"
          },
            React.DOM.div(
            {
              className: "building-upgrade-group-header"
            }, parentBuilding.template.name),
            React.DOM.table(
            {
              className: "buildable-item-list"
            },
              React.DOM.tbody(
              {

              },
                upgradeElements
              )
            )
          );

          upgradeGroups.push(parentElement);
        }

        return(
          React.DOM.ul(
          {
            className: "building-upgrade-list"
          },
            upgradeGroups
          )
        );
      }
    });
  }
}