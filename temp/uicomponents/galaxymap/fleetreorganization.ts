/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="fleetcontents.ts"/>

/// <reference path="../../fleet.ts" />

export interface PropTypes
{
  closeReorganization?: reactTypeTODO_func;
  fleets?: Fleet[];
}

export default class FleetReorganization extends React.Component<PropTypes, {}>
{
  displayName: string = "FleetReorganization";


  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
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
      var oldFleet: Rance.Fleet = draggingUnit.fleet;
      
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
    var selectedFleets: Rance.Fleet[] = this.props.fleets;
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
          UIComponents.FleetContents(
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
          UIComponents.FleetContents(
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
