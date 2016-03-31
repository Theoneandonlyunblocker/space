/// <reference path="../unitlist/list.ts" />
/// <reference path="trademoney.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeableItemsList = React.createFactory(React.createClass(
    {
      displayName: "TradeableItemsList",

      propTypes:
      {
        tradeableItems: React.PropTypes.object, // ITradeableItems
        availableItems: React.PropTypes.object,
        noListHeader: React.PropTypes.bool,
        onDragStart: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        adjustItemAmount: React.PropTypes.func
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
                keyTODO: "money",
                rowConstructor: UIComponents.TradeMoney,
                title: "Money",
                moneyAmount: item.amount,
                sortOrder: 0,
                onDragStart: this.props.onDragStart,
                onDragEnd: this.props.onDragEnd,
                onClick: this.props.onItemClick,
                adjustItemAmount: this.props.adjustItemAmount,
                maxMoneyAvailable: (this.props.availableItems && this.props.availableItems["money"]) ?
                  this.props.availableItems["money"].amount : undefined
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
                moneyAmount: item.amount,
                sortOrder: 1
              }
            });
          }
        }
      },

      render: function()
      {
        var tradeableItems: ITradeableItems = this.props.tradeableItems;
        var rows: IListItem[] = [];

        for (var key in tradeableItems)
        {
          rows.push(this.makeRowForTradeableItem(tradeableItems[key]));
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
    }));
  }
}
