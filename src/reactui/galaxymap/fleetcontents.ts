/// <reference path="shipinfo.ts"/>
/// <reference path="draggableshipinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var FleetContents = React.createClass(
    {
      displayName: "FleetContents",
      handleMouseUp: function()
      {
        if (!this.props.onMouseUp) return;

        this.props.onMouseUp(this.props.fleet);
      },

      render: function()
      {
        var shipInfos = [];

        var draggableContent =
        (
          this.props.onDragStart ||
          this.props.onDragEnd
        );

        for (var i = 0; i < this.props.fleet.ships.length; i++)
        {
          if (!draggableContent)
          {
            shipInfos.push(UIComponents.ShipInfo(
            {
              key: this.props.fleet.ships[i].id,
              ship: this.props.fleet.ships[i]
            }));
          }
          else
          {
            shipInfos.push(UIComponents.DraggableShipInfo(
            {
              key: this.props.fleet.ships[i].id,
              ship: this.props.fleet.ships[i],
              onDragStart: this.props.onDragStart,
              onDragMove: this.props.onDragMove,
              onDragEnd: this.props.onDragEnd
            }));
          }
        }

        if (draggableContent)
        {
          shipInfos.push(React.DOM.div(
          {
            className: "fleet-contents-dummy-ship",
            key: "dummy"
          }));
        }

        return(
          React.DOM.div(
          {
            className: "fleet-contents",
            onMouseUp: this.handleMouseUp
          },
            shipInfos
          )
        );
      }

    });
  }
}
