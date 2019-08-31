import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Manufactory} from "../../../../src/production/Manufactory";
import {ManufacturableThing} from "../../../../src/templateinterfaces/ManufacturableThing";

import {ManufactoryUpgradeButton} from "./ManufactoryUpgradeButton";
import {ManufacturableThingsList} from "./ManufacturableThingsList";


export interface PropTypes extends React.Props<any>
{
  manufactory: Manufactory;
  triggerUpdate: () => void;
  money: number;
}

interface StateType
{
}

export class BuildQueueComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BuildQueue";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.removeItem = this.removeItem.bind(this);
    this.upgradeCapacity = this.upgradeCapacity.bind(this);
  }

  upgradeCapacity()
  {
    const manufactory = this.props.manufactory;
    manufactory.upgradeCapacity(1);
    this.props.triggerUpdate();
  }

  render()
  {
    const manufactory = this.props.manufactory;

    const convertedBuildQueue: ManufacturableThing[] = [];

    for (let i = 0; i < manufactory.buildQueue.length; i++)
    {
      convertedBuildQueue.push(manufactory.buildQueue[i].template);
    }

    return(
      ReactDOMElements.div(
      {
        className: "build-queue",
      },
        ReactDOMElements.div(
        {
          className: "manufactory-upgrade-buttons-container",
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: manufactory.getCapacityUpgradeCost(),
            onClick: this.upgradeCapacity,
            actionString: localize("upgradeManufactoryCapacity")(),
            currentLevel: manufactory.capacity,
            maxLevel: manufactory.maxCapacity,
            levelDecimalPoints: 0,
            title: localize("upgradeManufactoryCapacityTooltip")(),
          }),
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: convertedBuildQueue,
          onClick: this.removeItem,
          showCost: false,
          money: this.props.money,
        }),
      )
    );
  }

  private removeItem(template: ManufacturableThing, parentIndex: number): void
  {
    const manufactory = this.props.manufactory;
    manufactory.removeThingAtIndex(parentIndex);
    this.props.triggerUpdate();
  }
}

export const BuildQueue: React.Factory<PropTypes> = React.createFactory(BuildQueueComponent);
