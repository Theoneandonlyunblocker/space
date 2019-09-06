import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {TradeableItem, TradeableItems} from "core/trade/Trade";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {TradeMoney} from "./TradeMoney";
import {TradeableItemProps} from "./TradeableItemProps";


export interface PropTypes extends React.Props<any>
{
  tradeableItems: TradeableItems;

  availableItems?: TradeableItems;
  onDragStart: (tradeableItemKey: string) => void;
  onDragEnd: () => void;
  onItemClick: (tradeableItemKey: string) => void;
  adjustItemAmount?: (tradeableItemKey: string, newAmount: number) => void;
}

interface StateType
{
}

export class TradeableItemsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TradeableItemsList";

  public state: StateType;

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
        return(
        {
          key: "money",
          // @ts-ignore 2322
          content: TradeMoney(
          {
            keyTODO: "money",
            title: localize("money").toString(),
            moneyAmount: item.amount,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            onClick: this.props.onItemClick,
            adjustItemAmount: this.props.adjustItemAmount,
            maxMoneyAvailable: (this.props.availableItems && this.props.availableItems["money"]) ?
              this.props.availableItems["money"].amount : undefined,
          }),
        });
      }
      default:
      {
        throw new Error(`Unrecognized tradeable item key ${item.key}`);
      }
    }
  }
  private static listItemSortOrder =
  {
    money: 0,
  };

  render()
  {
    const tradeableItems = this.props.tradeableItems;
    const rows: ListItem<TradeableItemProps>[] = [];

    for (const key in tradeableItems)
    {
      rows.push(this.makeRowForTradeableItem(tradeableItems[key]));
    }

    const columns: ListColumn<TradeableItemProps>[] =
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
        },
      },
    ];

    return(
      ReactDOMElements.div(
      {
        className: "tradeable-items-list fixed-table-parent",
      },
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[0]], // item
          noHeader: true,
        }),
      )
    );
  }
}

export const TradeableItemsList: React.Factory<PropTypes> = React.createFactory(TradeableItemsListComponent);
