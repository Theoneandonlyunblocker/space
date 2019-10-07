import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Item} from "core/src/items/Item";
import {Unit} from "core/src/unit/Unit";
import {AbilityBase} from "core/src/templateinterfaces/AbilityBase";
import {ListItemProps} from "../list/ListItemProps";

import {DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";


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
  public state: StateType;

  dragPositioner: DragPositioner<ItemListItemComponent>;
  private readonly ownDOMNode = React.createRef<HTMLTableRowElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
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
        if (isFinite(<number> cellContent))
        {
          cellProps.className += " center-text";
        }

        break;
      }
    }

    return(
      ReactDOMElements.td(cellProps, cellContent)
    );
  }

  private makeDragClone()
  {
    const clone = this.props.item.template.getIcon();
    clone.classList.add("item-icon-drag-clone", "draggable", "dragging");

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

    const rowProps: React.HTMLProps<HTMLTableRowElement> & React.ClassAttributes<HTMLTableRowElement> =
    {
      className: "item-list-item",
      onClick : this.props.handleClick,
      key: this.props.keyTODO, /*TODO react*/
      ref: this.ownDOMNode,
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
      ReactDOMElements.tr(rowProps,
        cells,
      )
    );
  }
}

export const ItemListItem: React.Factory<PropTypes> = React.createFactory(ItemListItemComponent);
