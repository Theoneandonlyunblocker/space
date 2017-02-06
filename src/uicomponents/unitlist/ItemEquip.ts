/// <reference path="../../../lib/react-global.d.ts" />

import MenuUnitInfo from "./MenuUnitInfo";
import UnitList from "./UnitList";
import {PropTypes as UnitListItemProps} from "./UnitListItem";
import {PropTypes as ItemListItemProps} from "./ItemListItem";
import ItemList from "./ItemList";

import ListItem from "../list/ListItem";

import Player from "../../Player";
import Unit from "../../Unit";
import Item from "../../Item";


export interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
  currentDragItem?: Item;
  selectedUnit?: Unit;
}

export class ItemEquipComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ItemEquip";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      selectedUnit: null,
      currentDragItem: null
    });
  }
  handleSelectRow(row: ListItem<UnitListItemProps | ItemListItemProps>)
  {
    if (!row.content.props.unit)
    {
      return;
    }

    this.setState(
    {
      selectedUnit: row.content.props.unit
    });
  }
  handleDragStart(item: Item)
  {
    this.setState(
    {
      currentDragItem: item
    });
  }
  handleDragEnd(dropSuccesful: boolean = false)
  {
    if (!dropSuccesful && this.state.currentDragItem && this.state.selectedUnit)
    {
      var item = this.state.currentDragItem;
      if (this.state.selectedUnit.items.hasItem(item))
      {
        this.state.selectedUnit.items.removeItem(item);
      }
    }

    this.setState(
    {
      currentDragItem: null
    });
  }
  handleDrop(index: number)
  {
    var item = this.state.currentDragItem;
    var unit = this.state.selectedUnit;
    if (unit && item)
    {
      unit.items.addItemAtPosition(item, index);
    }

    this.handleDragEnd(true);
  }

  render()
  {
    var player = this.props.player;

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
            currentDragItem: this.state.currentDragItem
          }),
          ItemList(
          {
            items: player.items,
            selectedUnit: this.state.selectedUnit, // only used to trigger updates
            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            onRowChange: this.handleSelectRow
          })
        ),

        UnitList(
        {
          units: player.units,
          selectedUnit: this.state.selectedUnit,
          isDraggable: false,
          onRowChange: this.handleSelectRow,
          autoSelect: true
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ItemEquipComponent);
export default Factory;
