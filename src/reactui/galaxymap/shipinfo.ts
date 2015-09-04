/// <reference path="../unit/unitstrength.ts"/>
/// <reference path="shipinfoname.ts"/>

module Rance
{
  export module UIComponents
  {
    export var ShipInfo = React.createClass(
    {
      displayName: "ShipInfo",
      mixins: [Draggable],

      onDragStart: function()
      {
        this.props.onDragStart(this.props.ship);
      },
      onDragEnd: function(e: DragEvent)
      {
        this.props.onDragEnd(e)
      },

      render: function()
      {
        var ship = this.props.ship;

        var divProps: any =
        {
          className: "ship-info"
        };

        if (this.props.isDraggable)
        {
          divProps.className += " draggable";
          divProps.onTouchStart = this.handleMouseDown;
          divProps.onMouseDown = this.handleMouseDown;

          if (this.state.dragging)
          {
            divProps.style = this.state.dragPos;
            divProps.className += " dragging";
          }
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
              UIComponents.ShipInfoName(
              {
                unit: ship
              }),
              React.DOM.div(
              {
                className: "ship-info-type"
              },
                ship.template.displayName
              )
            ),
            UIComponents.UnitStrength(
            {
              maxHealth: ship.maxHealth,
              currentHealth: ship.currentHealth,
              isSquadron: true
            })
            
          )
        );
      }
    });
  }
}
