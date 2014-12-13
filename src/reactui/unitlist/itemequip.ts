/// <reference path="itemlist.ts" />
/// <reference path="unitlist.ts" />

module Rance
{
  export module UIComponents
  {
    export var ItemEquip = React.createClass(
    {
      displayName: "ItemEquip",
      render: function()
      {
        var player = this.props.player;
        return(
          React.DOM.div({className: "unit-equip"},
            UIComponents.UnitList(
            {
              units: player.units,
              isDraggable: false
            }),
            UIComponents.ItemList(
            {
              items: player.items
            })
          )
        );
      }
    });
  }
}
