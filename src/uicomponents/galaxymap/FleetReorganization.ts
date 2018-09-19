import * as React from "react";

import {Fleet} from "../../Fleet";
import Unit from "../../Unit";
import eventManager from "../../eventManager";

import FleetContents from "./FleetContents";


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
      React.DOM.div(
      {
        className: "fleet-reorganization",
      },
        React.DOM.div(
        {
          className: "fleet-reorganization-subheader",
        },
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-left",
          }, selectedFleets[0].name.fullName),
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-center",
          }, null),
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-right",
          }, selectedFleets[1].name.fullName),
        ),
        React.DOM.div(
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
          React.DOM.div(
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

const factory: React.Factory<PropTypes> = React.createFactory(FleetReorganizationComponent);
export default factory;
