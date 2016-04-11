/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../player.ts" />
/// <reference path="../../star.ts" />

/// <reference path="buildingupgradelistitem.ts" />


import Player from "../../../src/Player.ts";
import BuildingUpgradeListItem from "./BuildingUpgradeListItem.ts";
import Star from "../../../src/Star.ts";
import Building from "../../../src/Building.ts";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  clearExpandedAction: reactTypeTODO_func;
}

interface StateType
{
  // TODO refactor | add state type
}

class BuildingUpgradeList_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildingUpgradeList";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  hasAvailableUpgrades()
  {
    var possibleUpgrades = this.props.star.getBuildingUpgrades();
    return Object.keys(possibleUpgrades).length > 0;
  }

  upgradeBuilding(upgradeData: IBuildingUpgradeData)
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
    else
    {
      this.forceUpdate();
    }
  }

  render()
  {
    if (!this.hasAvailableUpgrades()) return null;

    var upgradeGroups: React.HTMLElement[] = [];

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

        upgradeElements.push(BuildingUpgradeListItem(
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuildingUpgradeList_COMPONENT_TODO);
export default Factory;
