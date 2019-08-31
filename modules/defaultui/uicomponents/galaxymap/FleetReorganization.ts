import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Fleet} from "../../../../src/fleets/Fleet";
import {Unit} from "../../../../src/unit/Unit";
import {eventManager} from "../../../../src/app/eventManager";

import {FleetContents} from "./FleetContents";


export interface PropTypes extends React.Props<any>
{
  closeReorganization?: () => void;
  fleets?: Fleet[];
}

interface StateType
{
  currentDragUnit: Unit;
}

export class FleetReorganizationComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "FleetReorganization";
  public state: StateType;

  hasClosed: boolean = false;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      currentDragUnit: null,
    });
  }

  handleDragStart(unit: Unit)
  {
    this.setState(
    {
      currentDragUnit: unit,
    });
  }

  handleDragEnd()
  {
    this.setState(
    {
      currentDragUnit: null,
    });
  }

  handleDrop(fleet: Fleet)
  {
    const draggingUnit = this.state.currentDragUnit;
    if (draggingUnit)
    {
      const oldFleet: Fleet = draggingUnit.fleet;
      if (oldFleet !== fleet)
      {
        oldFleet.transferUnit(fleet, draggingUnit);
        eventManager.dispatchEvent("playerControlUpdated", null);
      }
    }

    this.handleDragEnd();
  }

  handleClose()
  {
    this.hasClosed = true;
    this.props.closeReorganization();
  }

  componentWillUnmount()
  {
    if (this.hasClosed) { return; }

    eventManager.dispatchEvent("endReorganizingFleets");
  }

  render()
  {
    const selectedFleets: Fleet[] = this.props.fleets;
    if (!selectedFleets || selectedFleets.length < 1)
    {
      return null;
    }

    return(
      ReactDOMElements.div(
      {
        className: "fleet-reorganization",
      },
        ReactDOMElements.div(
        {
          className: "fleet-reorganization-subheader",
        },
          ReactDOMElements.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-left",
          }, selectedFleets[0].name.fullName),
          ReactDOMElements.div(
          {
            className: "fleet-reorganization-subheader-center",
          }, null),
          ReactDOMElements.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-right",
          }, selectedFleets[1].name.fullName),
        ),
        ReactDOMElements.div(
        {
          className: "fleet-reorganization-contents",
        },
          FleetContents(
          {
            fleet: selectedFleets[0],

            onMouseUp: this.handleDrop,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            player: selectedFleets[0].player,
          }),
          ReactDOMElements.div(
          {
            className: "fleet-reorganization-contents-divider",
          }, null),
          FleetContents(
          {
            fleet: selectedFleets[1],

            onMouseUp: this.handleDrop,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            player: selectedFleets[0].player,
          }),
        ),
      )
    );
  }

}

export const FleetReorganization: React.Factory<PropTypes> = React.createFactory(FleetReorganizationComponent);
