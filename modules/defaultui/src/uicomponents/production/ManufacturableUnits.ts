import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Manufactory} from "core/src/production/Manufactory";
import {Star} from "core/src/map/Star";
import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";
import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import {ManufactoryUpgradeButton} from "./ManufactoryUpgradeButton";
import {ManufacturableThingsList} from "./ManufacturableThingsList";
import { Player } from "core/src/player/Player";
import { coreManufacturableThingKinds } from "core/src/production/coreManufacturableThingKinds";


export interface PropTypes extends React.Props<any>
{
  selectedLocation: Star | undefined;
  manufacturableThings: ManufacturableThing[];
  triggerParentUpdate: () => void;
  canManufacture: boolean;
  player: Player;
}

interface StateType
{
}

export class ManufacturableUnitsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableUnits";


  shouldComponentUpdate(newProps: PropTypes)
  {
    if (this.props.selectedLocation !== newProps.selectedLocation)
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
    if (this.props.canManufacture !== newProps.canManufacture)
    {
      return true;
    }

    return false;
  }

  addUnitToBuildQueue(template: UnitTemplate)
  {
    const manufactory: Manufactory = this.props.selectedLocation.manufactory;
    manufactory.addThingToQueue(template, coreManufacturableThingKinds.unit);
    this.props.triggerParentUpdate();
  }

  public state: StateType;

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
    const manufactory: Manufactory = this.props.selectedLocation.manufactory;
    manufactory.upgradeUnitHealthModifier(0.1);
    this.props.triggerParentUpdate();
  }

  upgradeStats()
  {
    const manufactory: Manufactory = this.props.selectedLocation.manufactory;
    manufactory.upgradeUnitStatsModifier(0.1);
    this.props.triggerParentUpdate();
  }

  render()
  {
    const selectedStarHasManufactory = this.props.selectedLocation && this.props.selectedLocation.manufactory;

    let manufactoryUpgradeButtons: React.ReactElement<any> = null;
    if (selectedStarHasManufactory)
    {
      const manufactory: Manufactory = this.props.selectedLocation.manufactory;
      const unitUpgradeCost = manufactory.getUnitModifierUpgradeCost();

      manufactoryUpgradeButtons = ReactDOMElements.div(
      {
        className: "manufactory-upgrade-buttons-container",
      },
        ManufactoryUpgradeButton(
        {
          money: this.props.player.resources.money,
          upgradeCost: unitUpgradeCost,
          actionString: localize("upgradeHealth").toString(),
          currentLevel: manufactory.unitHealthModifier,
          maxLevel: 5.0,
          levelDecimalPoints: 1,
          onClick: this.upgradeHealth,
          title: localize("increaseBaseHealthOfUnitsBuiltHere").toString(),
        }),
        ManufactoryUpgradeButton(
        {
          money: this.props.player.resources.money,
          upgradeCost: unitUpgradeCost,
          actionString: localize("upgradeStats").toString(),
          currentLevel: manufactory.unitStatsModifier,
          maxLevel: 5.0,
          levelDecimalPoints: 1,
          onClick: this.upgradeStats,
          title: localize("increaseBaseStatsOfUnitsBuiltHere").toString(),
        }),
      );
    }

    return(
      ReactDOMElements.div(
      {
        className: "manufacturable-units",
      },
        manufactoryUpgradeButtons,
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canManufacture ? <any>this.addUnitToBuildQueue : null),
          showCost: true,
          player: this.props.player,
        }),
      )
    );
  }
}

export const ManufacturableUnits: React.Factory<PropTypes> = React.createFactory(ManufacturableUnitsComponent);
