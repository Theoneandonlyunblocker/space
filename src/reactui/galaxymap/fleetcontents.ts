/// <reference path="shipinfo.ts"/>

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
        var shipInfos: ReactComponentPlaceHolder[] = [];

        var hasDraggableContent =
        (
          this.props.onDragStart ||
          this.props.onDragEnd
        );

        for (var i = 0; i < this.props.fleet.ships.length; i++)
        {
          shipInfos.push(UIComponents.ShipInfo(
          {
            key: this.props.fleet.ships[i].id,
            ship: this.props.fleet.ships[i],
            isDraggable: hasDraggableContent,
            onDragStart: this.props.onDragStart,
            onDragMove: this.props.onDragMove,
            onDragEnd: this.props.onDragEnd
          }));
        }

        if (hasDraggableContent)
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
