/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufactoryupgradebutton.ts" />

export interface PropTypes
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
  // TODO refactor | add state type
}

export default class ManufacturableItems extends React.Component<PropTypes, StateType>
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
          UIComponents.ManufactoryUpgradeButton(
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
        UIComponents.ManufacturableThingsList(
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
