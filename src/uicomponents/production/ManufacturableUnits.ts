/// <reference path="../../../lib/react-global.d.ts" />

import Star from "../../Star";
import UnitTemplate from "../../templateinterfaces/UnitTemplate";
import ManufacturableThingsList from "./ManufacturableThingsList";
import ManufactoryUpgradeButton from "./ManufactoryUpgradeButton";
import Manufactory from "../../Manufactory";
import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";

export interface PropTypes extends React.Props<any>
{
  selectedStar?: Star;
  consolidateLocations: boolean;
  manufacturableThings: ManufacturableThing[];
  triggerUpdate: () => void;
  canBuild: boolean;
  money: number;
}

interface StateType
{
}

export class ManufacturableUnitsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableUnits";


  shouldComponentUpdate(newProps: PropTypes)
  {
    if (this.props.selectedStar !== newProps.selectedStar)
    {
      return true;
    }
    if (this.props.manufacturableThings.length !== newProps.manufacturableThings.length)
    {
      return true;
    }
    else
    {

    }
    if (this.props.canBuild !== newProps.canBuild)
    {
      return true;
    }
    if (this.props.money !== newProps.money)
    {
      return true;
    }

    return false;
  }

  addUnitToBuildQueue(template: UnitTemplate)
  {
    var manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.addThingToQueue(template, "unit");
    this.props.triggerUpdate();
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.addUnitToBuildQueue = this.addUnitToBuildQueue.bind(this);
    this.upgradeStats = this.upgradeStats.bind(this);
    this.upgradeHealth = this.upgradeHealth.bind(this);
  }

  upgradeHealth()
  {
    var manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.upgradeUnitHealthModifier(0.1);
    this.props.triggerUpdate();
  }

  upgradeStats()
  {
    var manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.upgradeUnitStatsModifier(0.1);
    this.props.triggerUpdate();
  }

  render()
  {
    if (this.props.selectedStar && this.props.selectedStar.manufactory)
    {
      var manufactory: Manufactory = this.props.selectedStar.manufactory;
      var unitUpgradeCost = manufactory.getUnitUpgradeCost();
      var canAffordUnitUpgrade = this.props.money >= unitUpgradeCost;

      var unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
      var unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";

      if (!canAffordUnitUpgrade)
      {
        unitUpgradeButtonBaseClassName += " disabled";
        unitUpgradeCostBaseClassName += " negative";
      }
    }

    return(
      React.DOM.div(
      {
        className: "manufacturable-units"
      },
        (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : React.DOM.div(
        {
          className: "manufactory-upgrade-buttons-container"
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: unitUpgradeCost,
            actionString: "Upgrade health",
            currentLevel: manufactory.unitHealthModifier,
            maxLevel: 5.0,
            levelDecimalPoints: 1,
            onClick: this.upgradeHealth,
            title: "Increase base health of units built here"
          }),
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: unitUpgradeCost,
            actionString: "Upgrade stats",
            currentLevel: manufactory.unitStatsModifier,
            maxLevel: 5.0,
            levelDecimalPoints: 1,
            onClick: this.upgradeStats,
            title: "Increase base stats of units built here"
          })
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canBuild ? this.addUnitToBuildQueue : null),
          showCost: true,
          money: this.props.money
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableUnitsComponent);
export default Factory;
