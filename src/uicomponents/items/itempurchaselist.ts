/// <reference path="itempurchaselistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var ItemPurchaseList = React.createClass(
    {
      displayName: "ItemPurchaseList",

      getSlotIndex: function(slot: string)
      {
        if (slot === "high")
        {
          return 2;
        }
        else if (slot === "mid")
        {
          return 1;
        }
        else return 0;
      },

      render: function()
      {
        var rows: IListItem[] = [];

        for (var i = 0; i < this.props.items.length; i++)
        {
          var item = this.props.items[i];

          var data: any =
          {
            item: item,
            typeName: item.template.displayName,
            slot: item.template.slot,
            slotIndex: this.getSlotIndex(item.template.slot),
            techLevel: item.template.techLevel,
            buildCost: item.template.cost,
            playerMoney: this.props.playerMoney,

            rowConstructor: UIComponents.ItemPurchaseListItem
          };

          rows.push(
          {
            key: item.template.type,
            data: data
          });
        }

        var columns: IListColumn[] =
        [
          {
            label: "Type",
            key: "typeName",
            defaultOrder: "asc"
          },
          {
            label: "Slot",
            key: "slot",
            propToSortBy: "slotIndex",
            defaultOrder: "desc"
          },
          {
            label: "Tech",
            key: "techLevel",
            defaultOrder: "desc"
          },
          {
            label: "Cost",
            key: "buildCost",
            defaultOrder: "asc"
          }
        ]
       

        return(
          React.DOM.div({className: "item-purchase-list fixed-table-parent"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[1], columns[2]], // slot, tech
              onRowChange: this.props.onRowChange
            })
          )
        );
      }
    });
  }
}