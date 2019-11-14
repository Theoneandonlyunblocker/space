import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Manufactory} from "core/src/production/Manufactory";
import {Star} from "core/src/map/Star";
import {ItemTemplate} from "core/src/templateinterfaces/ItemTemplate";
import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";

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

export class ManufacturableItemsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableItems";


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

  addItemToBuildQueue(template: ItemTemplate)
  {
    const manufactory: Manufactory = this.props.selectedLocation.manufactory;
    manufactory.addThingToQueue(template, coreManufacturableThingKinds.item);
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
        (!this.props.selectedLocation || !this.props.selectedLocation.manufactory) ? null : ReactDOMElements.div(
        {
          className: "manufactory-upgrade-buttons-container",
        },
          ManufactoryUpgradeButton(
          {
            money: this.props.player.resources.money,
            upgradeCost: 0,
            actionString: localize("upgradeItems").toString(),
            currentLevel: 0,
            maxLevel: 0,
            levelDecimalPoints: 0,
            onClick: this.upgradeItems,
          }),
        ),
        ManufacturableThingsList(
        {
          manufacturableThings: this.props.manufacturableThings,
          onClick: (this.props.canManufacture ? <any>this.addItemToBuildQueue : undefined),
          showCost: true,
          player: this.props.player,
        }),
      )
    );
  }
}

export const ManufacturableItems: React.Factory<PropTypes> = React.createFactory(ManufacturableItemsComponent);
