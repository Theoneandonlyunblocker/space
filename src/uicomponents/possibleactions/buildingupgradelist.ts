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

      upgradeBuilding: function(upgradeData: IBuildingUpgradeData)
      {
        var star = upgradeData.parentBuilding.location

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

        var upgradeGroups: ReactDOMPlaceHolder[] = [];

        var possibleUpgrades = this.props.star.getBuildingUpgrades();
        var sortedParentBuildings = Object.keys(possibleUpgrades).sort(function(aId: string, bId: string)
        {
          var a = possibleUpgrades[aId][0].parentBuilding.template.displayName;
          var b = possibleUpgrades[bId][0].parentBuilding.template.displayName;
          
          if (a < b) return -1;
          else if (a > b) return 1;
          else return 0;
        });

        for (var i = 0; i < sortedParentBuildings.length; i++)
        {
          var parentBuildingId = sortedParentBuildings[i];
          var upgrades = possibleUpgrades[parentBuildingId];
          var parentBuilding: Building = upgrades[0].parentBuilding;

          var upgradeElements: ReactDOMPlaceHolder[] = [];

          for (var j = 0; j < upgrades.length; j++)
          {
            var upgrade: IBuildingUpgradeData = upgrades[j];

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
                }, upgrade.template.displayName + " " + (upgrade.level > 1 ? upgrade.level : "")),
                React.DOM.td(costProps, upgrade.cost)
              )
            );
          }

          var parentElement = React.DOM.div(
          {
            key: "" + parentBuilding.id,
            className: "building-upgrade-group"
          },
            React.DOM.div(
            {
              className: "building-upgrade-group-header"
            }, parentBuilding.template.displayName),
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