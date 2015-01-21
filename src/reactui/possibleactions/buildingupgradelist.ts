// /// <reference path="buildingupgradelistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildingUpgradeList = React.createClass(
    {
      displayName: "BuildingUpgradeList",

      upgradeBuilding: function(rowItem)
      {
        var upgradeData = rowItem.data.upgradeData;
      },

      render: function()
      {
        var possibleUpgrades = this.props.star.getBuildingUpgrades();
        if (Object.keys(possibleUpgrades).length < 1) return null;

        var upgradeGroups = [];

        for (var parentBuildingId in possibleUpgrades)
        {
          var upgrades = possibleUpgrades[parentBuildingId];
          var parentBuilding = upgrades[0].parentBuilding;

          var upgradeElements = [];

          for (var i = 0; i < upgrades.length; i++)
          {
            var upgrade = upgrades[i];

            upgradeElements.push(
              React.DOM.tr(
              {
                key: upgrade.template.type
              },
                React.DOM.td(
                {
                  key: "name"
                }, upgrade.template.name + " " + upgrade.level),
                React.DOM.td(
                {
                  key: "cost"
                }, upgrade.cost)
              )
            );
          }

          var parentElement = React.DOM.div(
          {
            key: parentBuilding.id
          },
            React.DOM.div(
            {

            }, parentBuilding.template.name),
            React.DOM.table(
            {

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

          },
            upgradeGroups
          )
        );
      }
    });
  }
}