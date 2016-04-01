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

export default class FleetUnitInfo extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = "FleetUnitInfo";
  mixins: reactTypeTODO_any = [Draggable];


  onDragStart: function()
  {
    this.props.onDragStart(this.props.unit);
  }
  onDragEnd: function(e: DragEvent)
  {
    this.props.onDragEnd(e)
  }

  render: function()
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
          UIComponents.FleetUnitInfoName(
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
        UIComponents.UnitStrength(
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
