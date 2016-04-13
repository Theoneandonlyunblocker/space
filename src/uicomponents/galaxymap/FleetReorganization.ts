/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";


import Unit from "../../Unit";
import FleetContents from "./FleetContents";
import fleets from "../../../modules/defaultmapmodes/maplayertemplates/fleets";
import Fleet from "../../Fleet";
import eventManager from "../../eventManager";


interface PropTypes extends React.Props<any>
{
  closeReorganization?: () => void;
  fleets?: Fleet[];
}

interface StateType
{
  currentDragUnit?: Unit;
}

export class FleetReorganizationComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetReorganization";
  state: StateType;
  
  hasClosed: boolean = false;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      currentDragUnit: null
    });
  }

  handleDragStart(unit: Unit)
  {
    this.setState(
    {
      currentDragUnit: unit
    });
  }

  handleDragEnd(dropSuccesful: boolean = false)
  {
    this.setState(
    {
      currentDragUnit: null
    });
  }

  handleDrop(fleet: Fleet)
  {
    var draggingUnit = this.state.currentDragUnit;
    if (draggingUnit)
    {
      var oldFleet: Fleet = draggingUnit.fleet;
      
      oldFleet.transferUnit(fleet, draggingUnit);
      eventManager.dispatchEvent("playerControlUpdated", null);
    }

    this.handleDragEnd(true);
  }

  handleClose()
  {
    this.hasClosed = true;
    this.props.closeReorganization();
  }

  componentWillUnmount()
  {
    if (this.hasClosed) return;

    eventManager.dispatchEvent("endReorganizingFleets");
  }

  render()
  {
    var selectedFleets: Fleet[] = this.props.fleets;
    if (!selectedFleets || selectedFleets.length < 1)
    {
      return null;
    }

    return(
      React.DOM.div(
      {
        className: "fleet-reorganization"
      },
        React.DOM.div(
        {
          className: "fleet-reorganization-header"
        }, "Reorganize fleets"),
        React.DOM.div(
        {
          className: "fleet-reorganization-subheader"
        },
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-left",
          }, selectedFleets[0].name),
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-center"
          }, null),
          React.DOM.div(
          {
            className: "fleet-reorganization-subheader-fleet-name" +
              " fleet-reorganization-subheader-fleet-name-right",
          }, selectedFleets[1].name)
        ),
        React.DOM.div(
        {
          className: "fleet-reorganization-contents"
        },
          FleetContents(
          {
            fleet: selectedFleets[0],

            onMouseUp: this.handleDrop,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            player: selectedFleets[0].player
          }),
          React.DOM.div(
          {
            className: "fleet-reorganization-contents-divider"
          }, null),
          FleetContents(
          {
            fleet: selectedFleets[1],

            onMouseUp: this.handleDrop,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            player: selectedFleets[0].player
          })
        ),
        React.DOM.div(
        {
          className: "fleet-reorganization-footer"
        },
          React.DOM.button(
          {
            className: "close-reorganization",
            onClick: this.handleClose
          }, "Close")
        )
      )
    );
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetReorganizationComponent);
export default Factory;
