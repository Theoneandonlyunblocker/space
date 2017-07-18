/// <reference path="../../../lib/react-global.d.ts" />

import Manufactory from "../../Manufactory";
import Star from "../../Star";
import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";
import UnitTemplate from "../../templateinterfaces/UnitTemplate";
import ManufactoryUpgradeButton from "./ManufactoryUpgradeButton";
import ManufacturableThingsList from "./ManufacturableThingsList";

import {localize} from "../../../localization/localize";


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
    const manufactory: Manufactory = this.props.selectedStar.manufactory;
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
    const manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.upgradeUnitHealthModifier(0.1);
    this.props.triggerUpdate();
  }

  upgradeStats()
  {
    const manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.upgradeUnitStatsModifier(0.1);
    this.props.triggerUpdate();
  }

  render()
  {
    const selectedStarHasManufactory = this.props.selectedStar && this.props.selectedStar.manufactory;

    let manufactoryUpgradeButtons: React.ReactElement<any> = null;
    if (selectedStarHasManufactory)
    {
      const manufactory: Manufactory = this.props.selectedStar.manufactory;
      const unitUpgradeCost = manufactory.getUnitUpgradeCost();
      const canAffordUnitUpgrade = this.props.money >= unitUpgradeCost;

      let unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
      let unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";

      if (!canAffordUnitUpgrade)
      {
        unitUpgradeButtonBaseClassName += " disabled";
        unitUpgradeCostBaseClassName += " negative";
      }

      manufactoryUpgradeButtons = React.DOM.div(
      {
        className: "manufactory-upgrade-buttons-container",
      },
        ManufactoryUpgradeButton(
        {
          money: this.props.money,
          upgradeCost: unitUpgradeCost,
          actionString: localize("upgradeHealth"),
          currentLevel: manufactory.unitHealthModifier,
          maxLevel: 5.0,
          levelDecimalPoints: 1,
          onClick: this.upgradeHealth,
          title: localize("increaseBaseHealthOfUnitsBuiltHere"),
        }),
        ManufactoryUpgradeButton(
        {
          money: this.props.money,
          upgradeCost: unitUpgradeCost,
          actionString: localize("upgradeStats"),
          currentLevel: manufactory.unitStatsModifier,
          maxLevel: 5.0,
          levelDecimalPoints: 1,
          onClick: this.upgradeStats,
          title: localize("increaseBaseStatsOfUnitsBuiltHere"),
        }),
      )
    }

    return(
      React.DOM.div(
      {
        className: "manufacturable-units",
      },
        manufactoryUpgradeButtons,
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canBuild ? this.addUnitToBuildQueue : null),
          showCost: true,
          money: this.props.money,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableUnitsComponent);
export default Factory;
