/// <reference path="../unitlist/list.ts" />
/// <reference path="trademoney.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeableItemsList = React.createClass(
    {
      displayName: "TradeableItemsList",

      propTypes:
      {
        availableItems: React.PropTypes.object, // ITradeableItems
        noListHeader: React.PropTypes.bool,
        onDragStart: React.PropTypes.func
      },

      makeRowForTradeableItem: function(item: ITradeableItem): IListItem
      {
        switch (item.key)
        {
          case "money":
          {
            return(
            {
              key: "money",
              data:
              {
                rowConstructor: UIComponents.TradeMoney,
                title: "Money",
                moneyAvailable: item.amount,
                sortOrder: 0,
                onDragStart: this.props.onDragStart
              }
            });
          }
          default:
          {
            return(
            {
              key: item.key,
              data:
              {
                rowConstructor: UIComponents.TradeMoney,
                title: item.key,
                moneyAvailable: item.amount,
                sortOrder: 1
              }
            });
          }
        }
      },

      render: function()
      {
        var availableItems: ITradeableItems = this.props.availableItems;
        var rows: IListItem[] = [];

        for (var key in availableItems)
        {
          rows.push(this.makeRowForTradeableItem(availableItems[key]));
        }

        var columns: IListColumn[] =
        [
          {
            label: "Item",
            key: "item",
            defaultOrder: "asc",
            propToSortBy: "sortOrder"
          }
        ];

        return(
          React.DOM.div(
          {
            className: "tradeable-items-list fixed-table-parent"
          },
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[0]], // item
              noHeader: this.props.noListHeader
            })
          )
        );
      }
    })
  }
}
