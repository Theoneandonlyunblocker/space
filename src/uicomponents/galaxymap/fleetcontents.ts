/// <reference path="fleetunitinfo.ts"/>

/// <reference path="../../fleet.ts" />
/// <reference path="../../player.ts" />

module Rance
{
  export module UIComponents
  {
    export var FleetContents = React.createFactory(React.createClass(
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
        var fleetUnitInfos: ReactComponentPlaceHolder[] = [];
        var fleet: Rance.Fleet = this.props.fleet;

        var hasDraggableContent = Boolean(
          this.props.onDragStart ||
          this.props.onDragEnd
        );

        for (var i = 0; i < fleet.units.length; i++)
        {
          var unit = fleet.units[i];
          fleetUnitInfos.push(UIComponents.FleetUnitInfo(
          {
            key: unit.id,
            unit: unit,
            isDraggable: hasDraggableContent,
            onDragStart: this.props.onDragStart,
            onDragMove: this.props.onDragMove,
            onDragEnd: this.props.onDragEnd,
            isIdentified: this.props.player.unitIsIdentified(unit)
          }));
        }

        if (hasDraggableContent)
        {
          fleetUnitInfos.push(React.DOM.div(
          {
            className: "fleet-contents-dummy-unit",
            key: "dummy"
          }));
        }

        return(
          React.DOM.div(
          {
            className: "fleet-contents",
            onMouseUp: this.handleMouseUp
          },
            fleetUnitInfos
          )
        );
      }

    }));
  }
}
