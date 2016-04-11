/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="fleetcontents.ts"/>

/// <reference path="../../fleet.ts" />


import Unit from "../unit/Unit.ts";
import FleetContents from "./FleetContents.ts";
import fleets from "../../../modules/defaultmapmodes/maplayertemplates/fleets.ts";
import Fleet from "../../../src/Fleet.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes extends React.Props<any>
{
  closeReorganization?: reactTypeTODO_func;
  fleets?: Fleet[];
}

interface StateType
{
  currentDragUnit?: any; // TODO refactor | define state type 456
}

class FleetReorganization_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetReorganization";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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

const Factory: React.Factory<PropTypes> = React.createFactory(FleetReorganization_COMPONENT_TODO);
export default Factory;
