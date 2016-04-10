/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufacturablethingslist.ts" />
/// <reference path="manufactoryupgradebutton.ts" />

/// <reference path="../../manufactory.ts" />


import ManufactoryUpgradeButton from "./ManufactoryUpgradeButton.ts";
import ManufacturableThingsList from "./ManufacturableThingsList.ts";
import Manufactory from "../../../src/Manufactory.ts";


export interface PropTypes
{
  manufactory: Manufactory;
  triggerUpdate: reactTypeTODO_func;
  money: number;
}

interface StateType
{
  // TODO refactor | add state type
}

class BuildQueue_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildQueue";


  removeItem(template: IManufacturableThing, parentIndex: number)
  {
    var manufactory: Manufactory = this.props.manufactory;
    manufactory.removeThingAtIndex(parentIndex);
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
    
  }
  
  upgradeCapacity()
  {
    var manufactory: Manufactory = this.props.manufactory;
    manufactory.upgradeCapacity(1);
    this.props.triggerUpdate();
  }

  render()
  {
    var manufactory: Manufactory = this.props.manufactory;

    var convertedBuildQueue: IManufacturableThing[] = [];

    for (var i = 0; i < manufactory.buildQueue.length; i++)
    {
      convertedBuildQueue.push(manufactory.buildQueue[i].template);
    }

    var canUpgradeCapacity = manufactory.capacity < manufactory.maxCapacity;

    return(
      React.DOM.div(
      {
        className: "build-queue"
      },
        React.DOM.div(
        {
          className: "manufactory-upgrade-buttons-container"
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: manufactory.getCapacityUpgradeCost(),
            onClick: this.upgradeCapacity,
            actionString: "Upgrade capacity",
            currentLevel: manufactory.capacity,
            maxLevel: manufactory.maxCapacity,
            levelDecimalPoints: 0,
            title: "Increase amount of things this manufactory can build per turn"
          })
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: convertedBuildQueue,
          onClick: this.removeItem,
          showCost: false
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuildQueue_COMPONENT_TODO);
export default Factory;
