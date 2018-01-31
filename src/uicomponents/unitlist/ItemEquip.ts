import * as React from "react";

import ItemList from "./ItemList";
import {PropTypes as ItemListItemProps} from "./ItemListItem";
import MenuUnitInfo from "./MenuUnitInfo";
import UnitList from "./UnitList";
import {PropTypes as UnitListItemProps} from "./UnitListItem";

import ListItem from "../list/ListItem";

import Item from "../../Item";
import Player from "../../Player";
import Unit from "../../Unit";


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
  public state: StateType;

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
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.equipItemOnSelectedUnit = this.equipItemOnSelectedUnit.bind(this);
  }

  public render()
  {
    const player = this.props.player;

    return(
      React.DOM.div({className: "item-equip"},
        React.DOM.div({className: "item-equip-left"},

          MenuUnitInfo(
          {
            unit: this.state.selectedUnit,
            onMouseUp: this.handleDrop,

            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            currentDragItem: this.state.currentDragItem,
          }),
          ItemList(
          {
            items: player.items,
            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            onRowChange: this.handleSelectRow,
          }),
        ),

        UnitList(
        {
          units: player.units,
          selectedUnit: this.state.selectedUnit,
          reservedUnits: [],
          unavailableUnits: player.units.filter(unit => !unit.canFightOffensiveBattle()),
          isDraggable: false,
          onRowChange: this.handleSelectRow,
          autoSelect: true,
          onMouseUp: this.equipItemOnSelectedUnit,
        }),
      )
    );
  }

  private handleSelectRow(row: ListItem<UnitListItemProps | ItemListItemProps>)
  {
    if (!row.content.props.unit)
    {
      return;
    }

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
    console.log("handledragend " + dropSuccessful)
    if (!dropSuccessful && this.state.currentDragItem && this.state.selectedUnit)
    {
      const item = this.state.currentDragItem;
      if (this.state.selectedUnit.items.hasItem(item))
      {
        console.log("fail drag remove");
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
    console.log("handledrop")
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
        console.log(`Unit list drop ${unit.template.type} => ${item.template.type}`);
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

const Factory: React.Factory<PropTypes> = React.createFactory(ItemEquipComponent);
export default Factory;
