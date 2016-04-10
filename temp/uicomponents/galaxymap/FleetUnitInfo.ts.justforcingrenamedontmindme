/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../unit/unitstrength.ts"/>
/// <reference path="fleetunitinfoname.ts"/>

/// <reference path="../../unit.ts" />

export interface PropTypes
{
  unit?: Unit;
  isIdentified: boolean;
  isDraggable: boolean;
  onDragStart?: reactTypeTODO_func;
  onDragEnd?: reactTypeTODO_func;
}

interface StateType
{
  // TODO refactor | add state type
}

class FleetUnitInfo extends React.Component<PropTypes, StateType>
{
  displayName: string = "FleetUnitInfo";
  mixins: reactTypeTODO_any = [Draggable];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
    var unit: Unit = this.props.unit;
    var isNotDetected = !this.props.isIdentified;

    var divProps: any =
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

const Factory: React.Factory<PropTypes> = React.createFactory(FleetUnitInfo);
export default Factory;
