/// <reference path="list.ts" />
/// <reference path="itemlistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var ItemList = React.createClass(
    {
      displayName: "ItemList",
      render: function()
      {
        var rows = [];

        for (var i = 0; i < this.props.items.length; i++)
        {
          var item = this.props.items[i];

          var data: any =
          {
            item: item,
            typeName: item.template.type,
            slot: item.template.slot,
            unitName: (item.unit ? item.unit.name : ""),

            isReserved: Boolean(item.unit),

            makeClone: true,
            rowConstructor: UIComponents.ItemListItem,
            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd
          };

          rows.push(
          {
            key: i,
            data: data
          });
        }

        var columns: any =
        [
          {
            label: "Type",
            key: "typeName",
            defaultOrder: "asc"
          },
          {
            label: "Slot",
            key: "slot",
            defaultOrder: "asd"
          },
          {
            label: "Unit",
            key: "unitName",
            defualtOrder: "asc"
          }
        ];

        return(
          React.DOM.div({className: "item-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns
            })
          )
        );
      }
    });
  }
}