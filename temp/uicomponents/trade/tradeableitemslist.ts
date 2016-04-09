/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../unitlist/list.ts" />
/// <reference path="trademoney.ts" />

export interface PropTypes
{
  tradeableItems?: reactTypeTODO_object; // ITradeableItems

  availableItems?: reactTypeTODO_object;
  noListHeader?: boolean;
  onDragStart?: reactTypeTODO_func;
  onDragEnd?: reactTypeTODO_func;
  onItemClick?: reactTypeTODO_func;
  adjustItemAmount?: reactTypeTODO_func;
}

interface StateType
{
  // TODO refactor | add state type
}

class TradeableItemsList extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeableItemsList";


  makeRowForTradeableItem(item: ITradeableItem): IListItem
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
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
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
}
