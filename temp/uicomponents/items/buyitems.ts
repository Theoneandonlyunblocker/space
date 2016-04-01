/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

// TODO | remove this folder
/// <reference path="itempurchaselist.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class BuyItems extends React.Component<PropTypes, {}>
{
  displayName: string = "BuyItems";

  handleSelectRow(row: IListItem)
  {
    var template: Templates.IItemTemplate = row.data.item.template;
    var item = new Item(template);
    
    this.props.player.addItem(item);
    this.props.player.money -= template.buildCost;

    eventManager.dispatchEvent("playerControlUpdated");
  }

  render()
  {
    var player = this.props.player;
    var items = player.getGloballyBuildableItems();

    if (items.length < 1)
    {
      return(
        React.DOM.div({className: "buy-items"},
          "You need to construct an item manufactory first"
        )
      );
    }

    return(
      React.DOM.div({className: "buy-items"},
        UIComponents.ItemPurchaseList(
        {
          items: items,
          onRowChange: this.handleSelectRow,
          playerMoney: this.props.player.money
        })
      )
    );
  }
}
