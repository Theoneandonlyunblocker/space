import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "core/src/items/Item";
import {Player} from "core/src/player/Player";
import {Unit} from "core/src/unit/Unit";
import {ListItem} from "../list/ListItem";

import {ItemList} from "./ItemList";
import {PropTypes as ItemListItemProps} from "./ItemListItem";
import {MenuUnitInfo} from "./MenuUnitInfo";
import {UnitList} from "./UnitList";
import {PropTypes as UnitListItemProps} from "./UnitListItem";


export interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
  currentDragItem: Item | null;
  selectedUnit: Unit | null;
}

export class ItemEquipComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ItemEquip";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      selectedUnit: null,
      currentDragItem: null,
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSelectItemListRow = this.handleSelectItemListRow.bind(this);
    this.handleSelectUnitListRow = this.handleSelectUnitListRow.bind(this);
    this.equipItemOnSelectedUnit = this.equipItemOnSelectedUnit.bind(this);
  }

  public override render()
  {
    const player = this.props.player;

    return(
      ReactDOMElements.div({className: "item-equip"},
        ReactDOMElements.div({className: "item-equip-left"},

          MenuUnitInfo(
          {
            unit: this.state.selectedUnit,
            onItemSlotMouseUp: this.handleDrop,

            itemsAreDraggable: true,
            onItemDragStart: this.handleDragStart,
            onItemDragEnd: this.handleDragEnd,
            currentDragItem: this.state.currentDragItem,
          }),
          ItemList(
          {
            items: player.items.filter(item => !item.template.isLockedToUnit),
            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            onRowChange: this.handleSelectItemListRow,
          }),
        ),

        UnitList(
        {
          units: player.units,
          selectedUnit: this.state.selectedUnit,
          reservedUnits: [],
          unavailableUnits: player.units.filter(unit => !unit.canFightOffensiveBattle()),
          isDraggable: false,
          onRowChange: this.handleSelectUnitListRow,
          autoSelect: true,
          onMouseUp: this.equipItemOnSelectedUnit,
        }),
      )
    );
  }

  private handleSelectItemListRow(row: ListItem<ItemListItemProps>): void
  {
    if (row.content.props.unit)
    {
      this.setState(
      {
        selectedUnit: row.content.props.unit,
      });
    }
  }
  private handleSelectUnitListRow(row: ListItem<UnitListItemProps>): void
  {
    this.setState(
    {
      selectedUnit: row.content.props.unit,
    });
  }
  private handleDragStart(item: Item)
  {
    this.setState(
    {
      currentDragItem: item,
    });
  }
  private handleDragEnd(dropSuccessful: boolean = false)
  {
    if (!dropSuccessful && this.state.currentDragItem && this.state.selectedUnit)
    {
      const item = this.state.currentDragItem;
      if (this.state.selectedUnit.items.hasItem(item))
      {
        this.state.selectedUnit.items.removeItem(item);
      }
    }

    this.setState(
    {
      currentDragItem: null,
    });
  }
  private handleDrop(index: number)
  {
    const item = this.state.currentDragItem;
    const unit = this.state.selectedUnit;
    if (unit && item)
    {
      unit.items.addItemAtPosition(item, index);
    }

    this.handleDragEnd(true);
  }
  private equipItemOnSelectedUnit(unit: Unit): void
  {
    const item = this.state.currentDragItem;

    if (item)
    {
      if (!unit.items.hasItem(item) && unit.items.hasSlotForItem(item))
      {
        unit.items.addItem(item);
        this.setState(
        {
          selectedUnit: unit,
        });
      }
    }

    this.handleDragEnd(true);
  }
}

export const ItemEquip: React.Factory<PropTypes> = React.createFactory(ItemEquipComponent);
