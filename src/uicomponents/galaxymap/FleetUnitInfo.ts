/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Unit from "../../Unit";
import FleetUnitInfoName from "./FleetUnitInfoName";
import UnitStrength from "../unit/UnitStrength";


interface PropTypes extends React.Props<any>
{
  unit?: Unit;
  isIdentified: boolean;
  isDraggable: boolean;
  onDragStart?: (unit: Unit) => void;
  onDragEnd?: (e: DragEvent) => void;
  onDragMove?: (x: number, y: number) => void;
}

interface StateType
{
  dragging?: boolean;
}

export class FleetUnitInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetUnitInfo";
  // mixins = [Draggable];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);    
  }
  
  onDragStart()
  {
    this.props.onDragStart(this.props.unit);
  }
  onDragEnd(e: DragEvent)
  {
    this.props.onDragEnd(e)
  }

  render()
  {
    var unit = this.props.unit;
    var isNotDetected = !this.props.isIdentified;

    var divProps: React.HTMLAttributes =
    {
      className: "fleet-unit-info"
    };

    if (this.props.isDraggable)
    {
      divProps.className += " draggable";
      divProps.onTouchStart = this.handleMouseDown;
      divProps.onMouseDown = this.handleMouseDown;

      if (this.state.dragging)
      {
        divProps.style = this.dragPos;
        divProps.className += " dragging";
      }
    }
 
    return(
      React.DOM.div(divProps,
        React.DOM.div(
        {
          className: "fleet-unit-info-icon-container"
        },
          React.DOM.img(
          {
            className: "fleet-unit-info-icon",
            src: isNotDetected ? "img\/icons\/unDetected.png" : unit.template.icon
          })
        ),
        React.DOM.div(
        {
          className: "fleet-unit-info-info"
        },
          FleetUnitInfoName(
          {
            unit: unit,
            isNotDetected: isNotDetected
          }),
          React.DOM.div(
          {
            className: "fleet-unit-info-type"
          },
            isNotDetected ? "???" : unit.template.displayName
          )
        ),
        UnitStrength(
        {
          maxHealth: unit.maxHealth,
          currentHealth: unit.currentHealth,
          isSquadron: true,
          isNotDetected: isNotDetected
        })
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FleetUnitInfoComponent);
export default Factory;
