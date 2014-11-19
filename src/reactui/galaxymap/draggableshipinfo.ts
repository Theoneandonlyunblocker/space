/// <reference path="../mixins/draggable.ts" />

/// <reference path="../unit/unitstrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var DraggableShipInfo = React.createClass(
    {
      mixins: [Draggable],

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.ship);
      },
      onDragEnd: function(e)
      {
        this.props.onDragEnd(e)
      },

      render: function()
      {
        var ship = this.props.ship;

        var divProps: any =
        {
          className: "ship-info",
          onTouchStart: this.handleMouseDown,
          onMouseDown: this.handleMouseDown
        };

        if (this.state.dragging)
        {
          divProps.style = this.state.dragPos;
          divProps.className += " dragging";
        }
 
        return(
          React.DOM.div(divProps,
            React.DOM.div(
            {
              className: "ship-info-icon-container"
            },
              React.DOM.img(
              {
                className: "ship-info-icon",
                src: ship.template.icon
              })
            ),
            React.DOM.div(
            {
              className: "ship-info-info"
            },
              React.DOM.div(
              {
                className: "ship-info-name"
              },
                ship.name
              ),
              React.DOM.div(
              {
                className: "ship-info-type"
              },
                ship.template.typeName
              )
            ),
            UIComponents.UnitStrength(
            {
              maxStrength: ship.maxStrength,
              currentStrength: ship.currentStrength,
              isSquadron: true
            })
            
          )
        );
      }
    });
  }
}
