import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Item} from "../../../../src/Item";
import {AbilityBase} from "../../../../src/templateinterfaces/AbilityBase";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {ItemListItem, PropTypes as ItemListItemProps} from "./ItemListItem";


export interface PropTypes extends React.Props<any>
{
  onDragEnd: (dropSuccessful?: boolean) => void;
  onDragStart: (item: Item) => void;
  isItemPurchaseList?: boolean;
  items: Item[];
  isDraggable: boolean;
  onRowChange: (row: ListItem<ItemListItemProps>) => void;
}

interface StateType
{
}

export class ItemListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ItemList";

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
    else { return 0; }
  }

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.getSlotIndex = this.getSlotIndex.bind(this);
  }

  render()
  {
    const rows: ListItem<ItemListItemProps>[] = [];
    const items: Item[] = this.props.items;

    for (let i = 0; i < items.length; i++)
    {
      const item = items[i];

      let ability: AbilityBase = null;
      let abilityIsPassive = false;
      if (item.template.ability)
      {
        ability = item.template.ability;
      }
      else if (item.template.passiveSkill)
      {
        ability = item.template.passiveSkill;
        abilityIsPassive = true;
      }

      const props: ItemListItemProps =
      {
        typeName: item.template.displayName,
        slot: item.template.slot,
        unitName: item.unit ? item.unit.name : "",

        item: item,
        key: item.id,
        keyTODO: item.id,
        id: item.id,
        slotIndex: this.getSlotIndex(item.template.slot),
        unit: item.unit ? item.unit : null,
        techLevel: item.template.techLevel,
        cost: item.template.buildCost,

        ability: ability,
        abilityIsPassive: abilityIsPassive,

        isReserved: Boolean(item.unit),

        dragPositionerProps:
        {
          shouldMakeClone: true,
          forcedDragOffset: {x: 32, y: 32},
        },
        isDraggable: this.props.isDraggable,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd,
      };

      rows.push(
      {
        key: "" + item.id,
        content: ItemListItem(props),
      });
    }

    const columns: ListColumn<ItemListItemProps>[] =
    [
      {
        label: localize("type")(),
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: localize("slot")(),
        key: "slot",
        propToSortBy: "slotIndex",
        defaultOrder: "desc",
      },
      {
        label: localize("unit")(),
        key: "unitName",
        defaultOrder: "desc",
      },
      {
        label: localize("ability")(),
        key: "ability",
        defaultOrder: "desc",
      },
    ];



    return(
      ReactDOMElements.div({className: "item-list fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[2]], // slot, unit
          onRowChange: this.props.onRowChange,
          tabIndex: 2,
          keyboardSelect: true,
        }),
      )
    );
  }
}

export const ItemList: React.Factory<PropTypes> = React.createFactory(ItemListComponent);
