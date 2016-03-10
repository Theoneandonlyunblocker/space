/// <reference path="shipinfo.ts"/>

/// <reference path="../../fleet.ts" />
/// <reference path="../../player.ts" />

module Rance
{
  export module UIComponents
  {
    export var FleetContents = React.createClass(
    {
      displayName: "FleetContents",

      propTypes:
      {
        fleet: React.PropTypes.instanceOf(Rance.Fleet).isRequired,
        player: React.PropTypes.instanceOf(Rance.Player).isRequired,

        onMouseUp: React.PropTypes.func,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        onDragMove: React.PropTypes.func,
      },

      handleMouseUp: function()
      {
        if (!this.props.onMouseUp) return;

        this.props.onMouseUp(this.props.fleet);
      },

      render: function()
      {
        var shipInfos: ReactComponentPlaceHolder[] = [];
        var fleet: Rance.Fleet = this.props.fleet;

        var hasDraggableContent =
        (
          this.props.onDragStart ||
          this.props.onDragEnd
        );

        for (var i = 0; i < fleet.units.length; i++)
        {
          var ship = fleet.units[i];
          shipInfos.push(UIComponents.ShipInfo(
          {
            key: ship.id,
            ship: ship,
            isDraggable: hasDraggableContent,
            onDragStart: this.props.onDragStart,
            onDragMove: this.props.onDragMove,
            onDragEnd: this.props.onDragEnd,
            isIdentified: this.props.player.unitIsIdentified(ship)
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
