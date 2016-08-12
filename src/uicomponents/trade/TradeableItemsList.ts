/// <reference path="../../../lib/react-global.d.ts" />

import TradeableItemProps from "./TradeableItemProps";
import {default as TradeMoney, PropTypes as TradeMoneyProps} from "./TradeMoney";

import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";
import List from "../list/List";

import {TradeableItems, TradeableItem} from "../../Trade";


export interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItems;

  availableItems?: TradeableItems;
  noListHeader?: boolean;
  onDragStart?: (tradeableItemKey: string) => void;
  onDragEnd?: () => void;
  onItemClick?: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;
}

interface StateType
{
}

export class TradeableItemsListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeableItemsList";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeRowForTradeableItem = this.makeRowForTradeableItem.bind(this);    
  }
  
  makeRowForTradeableItem(item: TradeableItem): ListItem<TradeableItemProps>
  {
    switch (item.key)
    {
      case "money":
      {
        return <ListItem<TradeMoneyProps>>(
        {
          key: "money",
          content: TradeMoney(
          {
            keyTODO: "money",
            title: "Money",
            moneyAmount: item.amount,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            onClick: this.props.onItemClick,
            adjustItemAmount: this.props.adjustItemAmount,
            maxMoneyAvailable: (this.props.availableItems && this.props.availableItems["money"]) ?
              this.props.availableItems["money"].amount : undefined
          })
        });
      }
    }
  }
  private static listItemSortOrder =
  {
    money: 0
  }
  
  render()
  {
    var tradeableItems = this.props.tradeableItems;
    var rows: ListItem<TradeableItemProps>[] = [];

    for (let key in tradeableItems)
    {
      rows.push(this.makeRowForTradeableItem(tradeableItems[key]));
    }

    var columns: ListColumn<TradeableItemProps>[] =
    [
      {
        label: "Item",
        key: "item",
        defaultOrder: "asc",
        sortingFunction: (a, b) =>
        {
          return(
            TradeableItemsListComponent.listItemSortOrder[a.content.props.keyTODO] -
              TradeableItemsListComponent.listItemSortOrder[b.content.props.keyTODO]
          );
        }
      }
    ];

    return(
      React.DOM.div(
      {
        className: "tradeable-items-list fixed-table-parent"
      },
        List(
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

const Factory: React.Factory<PropTypes> = React.createFactory(TradeableItemsListComponent);
export default Factory;
