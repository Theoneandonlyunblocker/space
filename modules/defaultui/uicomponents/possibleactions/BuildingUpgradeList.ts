import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Building} from "../../Building";
import BuildingUpgradeData from "../../BuildingUpgradeData";
import Player from "../../Player";
import Star from "../../Star";

import BuildingUpgradeListItem from "./BuildingUpgradeListItem";


export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  buildingUpgrades: {[buildingId: number]: BuildingUpgradeData[]};
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

  private hasAvailableUpgrades(): boolean
  {
    const possibleUpgrades = this.props.star.getBuildingUpgrades();

    return Object.keys(possibleUpgrades).length > 0;
  }

  private upgradeBuilding(upgradeData: BuildingUpgradeData): void
  {
    this.props.player.upgradeBuilding(upgradeData);

    this.forceUpdate();
  }

  public render()
  {
    const upgradeGroups: React.ReactHTMLElement<any>[] = [];

    const sortedParentBuildings = Object.keys(this.props.buildingUpgrades).sort((aId, bId) =>
    {
      const a = this.props.buildingUpgrades[aId][0].parentBuilding.template.displayName;
      const b = this.props.buildingUpgrades[bId][0].parentBuilding.template.displayName;

      if (a < b) { return -1; }
      else if (a > b) { return 1; }
      else { return 0; }
    });

    for (let i = 0; i < sortedParentBuildings.length; i++)
    {
      const parentBuildingId = sortedParentBuildings[i];
      const upgrades = this.props.buildingUpgrades[parentBuildingId];
      const parentBuilding: Building = upgrades[0].parentBuilding;

      const upgradeElements: React.ReactElement<any>[] = [];

      for (let j = 0; j < upgrades.length; j++)
      {
        if (j > 0)
        {
          upgradeElements.push(ReactDOMElements.tr(
          {
            className: "list-spacer",
            key: `spacer${i}${j}`,
          },
            ReactDOMElements.td(
            {
              colSpan: 20,
            },
              null,
            ),
          ));
        }

        upgradeElements.push(BuildingUpgradeListItem(
        {
          key: upgrades[j].template.type,
          player: this.props.player,
          handleUpgrade: this.upgradeBuilding,
          upgradeData: upgrades[j],
        }));
      }

      const parentElement = ReactDOMElements.div(
      {
        key: "" + parentBuilding.id,
        className: "building-upgrade-group",
      },
        ReactDOMElements.div(
        {
          className: "building-upgrade-group-header",
        }, parentBuilding.template.displayName),
        ReactDOMElements.table(
        {
          className: "buildable-item-list",
        },
          ReactDOMElements.tbody(
          {

          },
            upgradeElements,
          ),
        ),
      );

      upgradeGroups.push(parentElement);
    }

    return(
      ReactDOMElements.ul(
      {
        className: "building-upgrade-list",
      },
        upgradeGroups,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BuildingUpgradeListComponent);
export default factory;
