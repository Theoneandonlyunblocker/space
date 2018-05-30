import * as React from "react";

import Building from "../../Building";
import BuildingUpgradeData from "../../BuildingUpgradeData";
import Player from "../../Player";
import Star from "../../Star";
import BuildingUpgradeListItem from "./BuildingUpgradeListItem";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  clearExpandedAction: () => void;
}

interface StateType
{
}

export class BuildingUpgradeListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BuildingUpgradeList";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.hasAvailableUpgrades = this.hasAvailableUpgrades.bind(this);
    this.upgradeBuilding = this.upgradeBuilding.bind(this);
  }

  hasAvailableUpgrades()
  {
    const possibleUpgrades = this.props.star.getBuildingUpgrades();
    return Object.keys(possibleUpgrades).length > 0;
  }

  upgradeBuilding(upgradeData: BuildingUpgradeData)
  {
    const star = upgradeData.parentBuilding.location;

    const newBuilding = new Building(
    {
      template: upgradeData.template,
      location: star,
      controller: upgradeData.parentBuilding.controller,
      upgradeLevel: upgradeData.level,
      totalCost: upgradeData.parentBuilding.totalCost + upgradeData.cost,
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

    const upgradeGroups: React.ReactHTMLElement<any>[] = [];

    const possibleUpgrades = this.props.star.getBuildingUpgrades();
    const sortedParentBuildings = Object.keys(possibleUpgrades).sort((aId, bId) =>
    {
      const a = possibleUpgrades[aId][0].parentBuilding.template.displayName;
      const b = possibleUpgrades[bId][0].parentBuilding.template.displayName;

      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });

    for (let i = 0; i < sortedParentBuildings.length; i++)
    {
      const parentBuildingId = sortedParentBuildings[i];
      const upgrades = possibleUpgrades[parentBuildingId];
      const parentBuilding: Building = upgrades[0].parentBuilding;

      const upgradeElements: React.ReactElement<any>[] = [];

      for (let j = 0; j < upgrades.length; j++)
      {
        if (j > 0)
        {
          upgradeElements.push(React.DOM.tr(
          {
            className: "list-spacer",
            key: `spacer${i}${j}`,
          },
            React.DOM.td(
            {
              colSpan: 20,
            },
              null,
            ),
          ));
        };

        upgradeElements.push(BuildingUpgradeListItem(
        {
          key: upgrades[j].template.type,
          player: this.props.player,
          handleUpgrade: this.upgradeBuilding,
          upgradeData: upgrades[j],
        }));
      }

      const parentElement = React.DOM.div(
      {
        key: "" + parentBuilding.id,
        className: "building-upgrade-group",
      },
        React.DOM.div(
        {
          className: "building-upgrade-group-header",
        }, parentBuilding.template.displayName),
        React.DOM.table(
        {
          className: "buildable-item-list",
        },
          React.DOM.tbody(
          {

          },
            upgradeElements,
          ),
        ),
      );

      upgradeGroups.push(parentElement);
    }

    return(
      React.DOM.ul(
      {
        className: "building-upgrade-list",
      },
        upgradeGroups,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuildingUpgradeListComponent);
export default Factory;
