import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import Manufactory from "../../../../src/Manufactory";
import Star from "../../../../src/Star";
import ItemTemplate from "../../../../src/templateinterfaces/ItemTemplate";
import ManufacturableThing from "../../../../src/templateinterfaces/ManufacturableThing";

import ManufactoryUpgradeButton from "./ManufactoryUpgradeButton";
import ManufacturableThingsList from "./ManufacturableThingsList";


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

export class ManufacturableItemsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableItems";


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

  addItemToBuildQueue(template: ItemTemplate)
  {
    const manufactory: Manufactory = this.props.selectedStar.manufactory;
    manufactory.addThingToQueue(template, "item");
    this.props.triggerUpdate();
  }

  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "manufacturable-items",
      },
        (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : ReactDOMElements.div(
        {
          className: "manufactory-upgrade-buttons-container",
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: 0,
            actionString: localize("upgradeItems")(),
            currentLevel: 0,
            maxLevel: 0,
            levelDecimalPoints: 0,
            onClick: this.upgradeItems,
          }),
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          // @ts-ignore 2322
          onClick: (this.props.canBuild ? this.addItemToBuildQueue : undefined),
          showCost: true,
          money: this.props.money,
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ManufacturableItemsComponent);
export default factory;
