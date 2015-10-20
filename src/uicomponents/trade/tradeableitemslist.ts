/// <reference path="../../player.ts" />

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
        player: React.PropTypes.instanceOf(Player).isRequired,
      },

      render: function()
      {
        var player: Player = this.props.player;
        var rows: IListItem[] = [];

        // TODO trading
        rows.push(
        {
          key: "money",
          data:
          {
            rowConstructor: UIComponents.TradeMoney,
            title: "Money",
            moneyAvailable: player.money,
            sortOrder: 0
          }
        });

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
              initialSortOrder: [columns[0]] // item
            })
          )
        );
      }
    })
  }
}
