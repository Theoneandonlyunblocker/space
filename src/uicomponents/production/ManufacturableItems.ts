/// <reference path="../../../lib/react-global.d.ts" />

import Manufactory from "../../Manufactory";
import Star from "../../Star";
import ItemTemplate from "../../templateinterfaces/ItemTemplate";
import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";
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
  displayName: string = "ManufacturableItems";


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
        className: "manufacturable-items",
      },
        (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : React.DOM.div(
        {
          className: "manufactory-upgrade-buttons-container",
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.money,
            upgradeCost: 0,
            actionString: "Upgrade items",
            currentLevel: 0,
            maxLevel: 0,
            levelDecimalPoints: 0,
            onClick: this.upgradeItems,
          }),
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canBuild ? this.addItemToBuildQueue : null),
          showCost: true,
          money: this.props.money,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableItemsComponent);
export default Factory;
