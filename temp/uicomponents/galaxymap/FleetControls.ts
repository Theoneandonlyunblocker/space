/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../fleet.ts" />


import Fleet from "../../../src/Fleet.ts";
import eventManager from "../../../src/eventManager.ts";


interface PropTypes extends React.Props<any>
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
    var fleet = this.props.Fleet;

    var splitButtonProps: any =
    {
      className: "fleet-controls-split"
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
        className: "fleet-controls"
      },
        React.DOM.button(splitButtonProps,
          "split"
        ),
        React.DOM.button(
        {
          className: "fleet-controls-deselect",
          onClick: this.deselectFleet
        },
          "deselect"
        ),
        !this.props.hasMultipleSelected ? null : React.DOM.button(
        {
          className: "fleet-controls-select",
          onClick: this.selectFleet
        },
          "select"
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetControlsComponent);
export default Factory;
