/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

// TODO | remove this folder
/// <reference path="itempurchaselist.ts" />


import ItemTemplate from "../../../src/templateinterfaces/ItemTemplate.d.ts";
import ItemPurchaseList from "./ItemPurchaseList.ts";
import Item from "../../../src/Item.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class BuyItems_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuyItems";

  handleSelectRow(row: IListItem)
  {
    var template: ItemTemplate = row.data.item.template;
    var item = new Item(template);
    
    this.props.player.addItem(item);
    this.props.player.money -= template.buildCost;

    eventManager.dispatchEvent("playerControlUpdated");
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
        ItemPurchaseList(
        {
          items: items,
          onRowChange: this.handleSelectRow,
          playerMoney: this.props.player.money
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BuyItems_COMPONENT_TODO);
export default Factory;
