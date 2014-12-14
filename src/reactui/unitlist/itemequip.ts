/// <reference path="itemlist.ts" />
/// <reference path="unitlist.ts" />
/// <reference path="menuunitinfo.ts" />

module Rance
{
  export module UIComponents
  {
    export var ItemEquip = React.createClass(
    {
      displayName: "ItemEquip",
      getInitialState: function()
      {
        return(
        {
          selectedUnit: null,
          currentDragItem: null
        });
      },
      handleSelectRow: function(row)
      {
        this.setState(
        {
          selectedUnit: row.data.unit
        });
      },
      handleDragStart: function(item)
      {
        this.setState(
        {
          currentDragItem: item
        });
      },
      handleDragEnd: function(dropSuccesful: boolean = false)
      {
        if (!dropSuccesful && this.state.currentDragItem && this.state.selectedUnit)
        {
          var item = this.state.currentDragItem;
          if (this.state.selectedUnit.items[item.template.slot] === item)
          {
            this.state.selectedUnit.removeItem(item);
          }
        }

        this.setState(
        {
          currentDragItem: null
        });
      },
      handleDrop: function()
      {
        if (this.state.selectedUnit && this.state.currentDragItem)
        {
          this.state.selectedUnit.addItem(this.state.currentDragItem);
        }

        this.handleDragEnd(true);
      },

      render: function()
      {
        var player = this.props.player;

        return(
          React.DOM.div({className: "item-equip"},
            React.DOM.div({className: "item-equip-left"},

              UIComponents.MenuUnitInfo(
              {
                unit: this.state.selectedUnit,
                onMouseUp: this.handleDrop,

                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                currentDragItem: this.state.currentDragItem
              }),
              UIComponents.ItemList(
              {
                items: player.items,
                isDraggable: true,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd
              })
            ),

            UIComponents.UnitList(
            {
              units: player.units,
              isDraggable: false,
              onRowChange: this.handleSelectRow
            })
          )
        );
      }
    });
  }
}
