import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Manufactory} from "core/src/production/Manufactory";
import {Star} from "core/src/map/Star";
import {ItemTemplate} from "core/src/templateinterfaces/ItemTemplate";
import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";

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


  public override shouldComponentUpdate(newProps: PropTypes)
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

  public override state: StateType;

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

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "manufacturable-items",
      },
        ReactDOMElements.div(
        {
          className: "production-list-header",
        },
          // TODO 2019.11.17 | do something here
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
