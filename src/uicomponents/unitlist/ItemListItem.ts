import * as React from "react";

import Item from "../../Item";
import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";
import ListItemProps from "../list/ListItemProps";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends ListItemProps, React.Props<any>
{
  typeName: string;
  slot: string;
  unitName: string;

  item: Item;
  ability: AbilityBase;
  abilityIsPassive: boolean;
  isReserved: boolean;
  keyTODO: number;
  cost: number;
  techLevel: number;
  unit: Unit | null;
  slotIndex: number;
  id: number; // item id

  isDraggable: boolean;
  onDragEnd: (dropSuccessful?: boolean) => void;
  onDragStart: (item: Item) => void;
  dragPositionerProps?: DragPositionerProps;

}

interface StateType
{
}

export class ItemListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ItemListItem";

  state: StateType;
  dragPositioner: DragPositioner<ItemListItemComponent>;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      this.dragPositioner.makeDragClone = this.makeDragClone;
      applyMixins(this, this.dragPositioner);
    }
  }
  private bindMethods()
  {
    this.makeCell = this.makeCell.bind(this);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.makeDragClone = this.makeDragClone.bind(this);
  }

  private onDragStart()
  {
    this.props.onDragStart(this.props.item);
  }
  private onDragEnd()
  {
    this.props.onDragEnd();
  }

  private makeCell(type: string)
  {
    const cellProps: React.HTMLProps<HTMLTableCellElement> = {};
    cellProps.key = type;
    cellProps.className = "item-list-item-cell" + " item-list-" + type;

    let cellContent: string | number;

    switch (type)
    {
      case "ability":
      {
        if (this.props.ability)
        {
          cellProps.title = this.props.ability.description;
          if (this.props.abilityIsPassive)
          {
            cellProps.className += " passive-skill";
          }
          cellContent = this.props.ability.displayName;
        }

        break;
      }
      default:
      {
        cellContent = this.props[type];
        if (isFinite(<number>cellContent))
        {
          cellProps.className += " center-text";
        }

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  private makeDragClone()
  {
    const clone = new Image();
    clone.src = this.props.item.template.icon;
    clone.className = "item-icon-base draggable dragging";

    return clone;
  }

  render()
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    const rowProps: React.HTMLProps<HTMLTableRowElement> =
    {
      className: "item-list-item",
      onClick : this.props.handleClick,
      key: this.props.keyTODO,/*TODO react*/
    };

    if (this.dragPositioner)
    {
      rowProps.className += " draggable";
      rowProps.onTouchStart = rowProps.onMouseDown =
        this.dragPositioner.handleReactDownEvent;
    }

    // if (this.props.isSelected)
    // {
    //   rowProps.className += " selected-item";
    // };

    if (this.props.isReserved)
    {
      rowProps.className += " reserved-item";
    }



    return(
      React.DOM.tr(rowProps,
        cells,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ItemListItemComponent);
export default Factory;
