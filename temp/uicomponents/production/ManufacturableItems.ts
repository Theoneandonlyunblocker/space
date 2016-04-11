/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufactoryupgradebutton.ts" />


import ItemTemplate from "../../../src/templateinterfaces/ItemTemplate.d.ts";
import Star from "../../../src/Star.ts";
import ManufacturableThingsList from "./ManufacturableThingsList.ts";
import ManufactoryUpgradeButton from "./ManufactoryUpgradeButton.ts";
import Manufactory from "../../../src/Manufactory.ts";


export interface PropTypes extends React.Props<any>
{
  selectedStar?: Star;
  consolidateLocations: boolean;
  manufacturableThings: reactTypeTODO_couldntConvert;
  triggerUpdate: reactTypeTODO_func;
  canBuild: boolean;
  money: number;
}

interface StateType
{
}

class ManufacturableItems_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableItems";


  shouldComponentUpdate(newProps: any)
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

  addItemToBuildQueue(template: ItemTemplate)
  {
    var manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.addThingToQueue(template, "item");
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
    this.upgradeItems = this.upgradeItems.bind(this);
    this.addItemToBuildQueue = this.addItemToBuildQueue.bind(this);    
  }
  
  upgradeItems()
  {

  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "manufacturable-items"
      },
        (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : React.DOM.div(
        {
          className: "manufactory-upgrade-buttons-container"
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: 0,
            actionString: "Upgrade items",
            currentLevel: 0,
            maxLevel: 0,
            levelDecimalPoints: 0,
            onClick: this.upgradeItems
          })
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canBuild ? this.addItemToBuildQueue : null),
          showCost: true,
          money: this.props.money
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableItems_COMPONENT_TODO);
export default Factory;
