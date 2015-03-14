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

            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            currentDragItem: this.props.currentDragItem
          }));
        }

        var abilityElements = [];
        var abilities = unit.getAllAbilities();

        for (var i = 0; i < abilities.length; i++)
        {
          var ability = abilities[i];

          abilityElements.push(
            React.DOM.li(
            {
              key: ability.type
            },
              ability.displayName
            )
          );
        }
      
        return(
          React.DOM.div(
          {
            className: "menu-unit-info"
          },
            React.DOM.div(
            {
              className: "menu-unit-info-image unit-image" // UNIT IMAGE TODO
            },
              null
            ),
            React.DOM.ul(
            {
              className: "menu-unit-info-abilities"
            },
              abilityElements
            ),
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