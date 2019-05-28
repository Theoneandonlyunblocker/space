import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Fleet} from "../../Fleet";
import eventManager from "../../eventManager";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  fleet: Fleet;
  isInspecting?: boolean;
  hasMultipleSelected?: boolean;
}

interface StateType
{
}

export class FleetControlsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetControls";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.deselectFleet = this.deselectFleet.bind(this);
    this.selectFleet = this.selectFleet.bind(this);
    this.splitFleet = this.splitFleet.bind(this);
  }

  deselectFleet()
  {
    eventManager.dispatchEvent("deselectFleet", this.props.fleet);
  }

  selectFleet()
  {
    eventManager.dispatchEvent("selectFleets", [this.props.fleet]);
  }

  splitFleet()
  {
    eventManager.dispatchEvent("splitFleet", this.props.fleet);
  }

  render()
  {
    const fleet = this.props.fleet;

    const splitButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
    {
      className: "fleet-controls-split",
    };
    if (fleet.units.length > 1 && !this.props.isInspecting)
    {
      splitButtonProps.onClick = this.splitFleet;
    }
    else
    {
      splitButtonProps.className += " disabled";
      splitButtonProps.disabled = true;
    }

    return(
      ReactDOMElements.div(
      {
        className: "fleet-controls",
      },
        ReactDOMElements.button(splitButtonProps,
          localize("split_fleet")(),
        ),
        ReactDOMElements.button(
        {
          className: "fleet-controls-deselect",
          onClick: this.deselectFleet,
        },
          localize("deselect_fleet")(),
        ),
        !this.props.hasMultipleSelected ? null : ReactDOMElements.button(
        {
          className: "fleet-controls-select",
          onClick: this.selectFleet,
        },
          localize("select_fleet")(),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(FleetControlsComponent);
export default factory;
