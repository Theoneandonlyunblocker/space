/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="itemlist.ts" />
/// <reference path="unitlist.ts" />
/// <reference path="menuunitinfo.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

export default class ItemEquip extends React.Component<PropTypes, StateType>
{
  displayName: string = "ItemEquip";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      selectedUnit: null,
      currentDragItem: null
    });
  }
  handleSelectRow(row: IListItem)
  {
    if (!row.data.unit) return;

    this.setState(
    {
      selectedUnit: row.data.unit
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
      if (this.state.selectedUnit.items[item.template.slot] === item)
      {
        this.state.selectedUnit.removeItem(item);
      }
    }

    this.setState(
    {
      currentDragItem: null
    });
  }
  handleDrop()
  {
    var item = this.state.currentDragItem;
    var unit = this.state.selectedUnit;
    if (unit && item)
    {
      if (unit.items[item.template.slot])
      {
        unit.removeItemAtSlot(item.template.slot);
      }
      unit.addItem(item);
    }

    this.handleDragEnd(true);
  }

  render()
  {
    var player = this.props.player;

    return(
      React.DOM.div({className: "item-equip"},
        React.DOM.div({className: "item-equip-left"},

          UIComponents.MenuUnitInfo(
          {
            unit: this.state.selectedUnit,
            onMouseUp: this.handleDrop,

            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            currentDragItem: this.state.currentDragItem
          }),
          UIComponents.ItemList(
          {
            items: player.items,
            // only used to trigger updates
            selectedUnit: this.state.selectedUnit,
            isDraggable: true,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            onRowChange: this.handleSelectRow
          })
        ),

        UIComponents.UnitList(
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
