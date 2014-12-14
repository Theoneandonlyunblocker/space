/// <reference path="unititemwrapper.ts"/>

module Rance
{
  export module UIComponents
  {
    export var MenuUnitInfo = React.createClass(
    {
      displayName: "MenuUnitInfo",
      render: function()
      {
        var unit = this.props.unit;
        if (!unit) return(
          React.DOM.div({className: "menu-unit-info"})
        )

        var itemSlots = [];

        for (var slot in unit.items)
        {
          itemSlots.push(UIComponents.UnitItemWrapper(
          {
            key: slot,
            slot: slot,
            item: unit.items[slot],
            onMouseUp: this.props.onMouseUp,

            isDraggable: true,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            currentDragItem: this.props.currentDragItem
          }));
        }
      
        return(
          React.DOM.div(
          {
            className: "menu-unit-info"
          },
            React.DOM.div(
            {
              className: "menu-unit-info-items-wrapper"
            },
              itemSlots
            )
          )
        );
      }
    });
  }
}