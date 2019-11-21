import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Manufactory} from "core/src/production/Manufactory";
import {Star} from "core/src/map/Star";
import {ManufacturableThing} from "core/src/templateinterfaces/ManufacturableThing";
import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

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

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.addUnitToBuildQueue = this.addUnitToBuildQueue.bind(this);
  }

  public shouldComponentUpdate(newProps: PropTypes)
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
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "manufacturable-units",
      },
        ReactDOMElements.div(
        {
          className: "production-list-header",
        },
          // TODO 2019.11.17 | show modifiers affecting unit stats here
        ),
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

  private addUnitToBuildQueue(template: UnitTemplate)
  {
    const manufactory: Manufactory = this.props.selectedLocation.manufactory;
    manufactory.addThingToQueue(template, coreManufacturableThingKinds.unit);
    this.props.triggerParentUpdate();
  }
}

export const ManufacturableUnits: React.Factory<PropTypes> = React.createFactory(ManufacturableUnitsComponent);
