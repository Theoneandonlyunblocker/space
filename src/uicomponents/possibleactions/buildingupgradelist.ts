/// <reference path="../../player.ts" />
/// <reference path="../../star.ts" />

/// <reference path="buildingupgradelistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildingUpgradeList = React.createClass(
    {
      displayName: "BuildingUpgradeList",

      propTypes:
      {
        star: React.PropTypes.instanceOf(Star).isRequired,
        player: React.PropTypes.instanceOf(Player).isRequired,
        clearExpandedAction: React.PropTypes.func.isRequired
      },

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

          var upgradeElements: ReactComponentPlaceHolder[] = [];

          for (var j = 0; j < upgrades.length; j++)
          {
            if (j > 0)
            {
              upgradeElements.push(React.DOM.tr(
              {
                className: "list-spacer",
                key: "spacer" + i + j
              },
                React.DOM.td(
                {
                  colSpan: 20
                },
                  null
                )
              ))
            };

            upgradeElements.push(UIComponents.BuildingUpgradeListItem(
            {
              key: upgrades[j].template.type,
              player: this.props.player,
              handleUpgrade: this.upgradeBuilding,
              upgradeData: upgrades[j]
            }));
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