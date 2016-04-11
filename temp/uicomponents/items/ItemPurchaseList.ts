/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="itempurchaselistitem.ts" />


import ItemPurchaseListItem from "./ItemPurchaseListItem.ts";
import List from "../unitlist/List.ts";
import Item from "../../../src/Item.ts";


export interface PropTypes extends React.Props<any>
{
  items: any; // TODO refactor | define prop type 123
  playerMoney: any; // TODO refactor | define prop type 123
  onRowChange: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class ItemPurchaseList_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "ItemPurchaseList";

  getSlotIndex(slot: string)
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
    var rows: IListItem[] = [];
    var items: Item[] = this.props.items;

    for (var i = 0; i < items.length; i++)
    {
      var item = items[i];

      var data: any =
      {
        item: item,
        typeName: item.template.displayName,
        slot: item.template.slot,
        slotIndex: this.getSlotIndex(item.template.slot),
        techLevel: item.template.techLevel,
        buildCost: item.template.buildCost,
        playerMoney: this.props.playerMoney,

        rowConstructor: ItemPurchaseListItem
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
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[2]], // slot, tech
          onRowChange: this.props.onRowChange
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ItemPurchaseList_COMPONENT_TODO);
export default Factory;
