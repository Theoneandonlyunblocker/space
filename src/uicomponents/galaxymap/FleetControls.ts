/// <reference path="../../../lib/react-global.d.ts" />

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
  displayName: string = "FleetControls";


  state: StateType;

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

    const splitButtonProps: React.HTMLAttributes =
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
      React.DOM.div(
      {
        className: "fleet-controls",
      },
        React.DOM.button(splitButtonProps,
          localize("split_imperative"),
        ),
        React.DOM.button(
        {
          className: "fleet-controls-deselect",
          onClick: this.deselectFleet,
        },
          localize("deselect_imperative"),
        ),
        !this.props.hasMultipleSelected ? null : React.DOM.button(
        {
          className: "fleet-controls-select",
          onClick: this.selectFleet,
        },
          localize("select_imperative"),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetControlsComponent);
export default Factory;
