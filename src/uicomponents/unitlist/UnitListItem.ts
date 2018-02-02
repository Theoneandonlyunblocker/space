import * as React from "react";
import * as ReactDOM from "react-dom";

import Unit from "../../Unit";
import {shallowExtend} from "../../utility";
import ListItemProps from "../list/ListItemProps";
import {default as UnitComponentFactory} from "../unit/Unit";
import UnitStrength from "../unit/UnitStrength";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  id: number;
  typeName: string;
  strength: string;
  maxActionPoints: number;
  attack: number;
  defence: number;
  intelligence: number;
  speed: number;

  isHovered: boolean;
  currentHealth: number;
  isReserved: boolean;
  isUnavailable: boolean;
  isSelected: boolean;
  onMouseEnter?: (unit: Unit) => void;
  onMouseLeave?: () => void;
  onMouseUp?: (unit: Unit) => void;
  maxHealth: number;
  unit: Unit;

  isDraggable: boolean;
  onDragEnd?: (dropSuccessful?: boolean) => void;
  onDragStart?: (unit: Unit) => void;
  dragPositionerProps?: DragPositionerProps;

  name: string; // unused
}

interface StateType
{
}
export class UnitListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitListItem";

  public state: StateType;
  dragPositioner: DragPositioner<UnitListItemComponent>;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.makeDragClone = this.makeDragClone;
      // this.dragPositioner.onDragMove = this.onDragMove;
      this.dragPositioner.onDragEnd = this.onDragEnd;
      applyMixins(this, this.dragPositioner);
    }
  }
  private bindMethods()
  {
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.makeCell = this.makeCell.bind(this);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.makeDragClone = this.makeDragClone.bind(this);
    // this.onDragMove = this.onDragMove.bind(this);
  }

  componentDidMount()
  {
    if (!this.props.isDraggable) return;

    const container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    this.dragPositioner.forcedDragOffset =
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2,
    };
  }

  // componentDidUpdate()
  // {
  //   if (this.dragPositioner.needsFirstTouchUpdate && this.ref_TODO_dragClone)
  //   {
  //     const node = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
  //     node.classList.add("draggable");
  //     node.classList.add("dragging");

  //     const container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

  //     node.style.width = "" + container.offsetWidth + "px";
  //     node.style.height = "" + container.offsetHeight + "px";

  //     this.dragPositioner.needsFirstTouchUpdate = false;
  //   }
  // }

  onDragStart()
  {
    if (!this.props.onDragStart)
    {
      throw new Error("Draggable list item must specify props.onDragStart handler");
    }
    this.props.onDragStart(this.props.unit);
  }
  makeDragClone()
  {
    const container = document.createElement("div");

    ReactDOM.render(
      UnitComponentFactory(shallowExtend(
        this.props.unit.getDisplayData("battlePrep"),
        {id: this.props.unit.id},
      )),
      container,
    );

    const renderedElement = <HTMLElement> container.firstChild;
    const wrapperElement = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    renderedElement.classList.add("draggable", "dragging");

    renderedElement.style.width = "" + wrapperElement.offsetWidth + "px";
    renderedElement.style.height = "" + wrapperElement.offsetHeight + "px";
    this.dragPositioner.forcedDragOffset =
    {
      x: wrapperElement.offsetWidth / 2,
      y: wrapperElement.offsetHeight / 2,
    };

    return renderedElement;
  }
  // onDragMove(x: number, y: number)
  // {
  //   if (!this.ref_TODO_dragClone) return;

  //   const node = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
  //   node.classList.add("draggable");
  //   node.classList.add("dragging");
  //   node.style.left = "" + x + "px";
  //   node.style.top = "" + y + "px";

  //   const container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

  //   node.style.width = "" + container.offsetWidth + "px";
  //   node.style.height = "" + container.offsetHeight + "px";


  //   this.dragPositioner.forcedDragOffset =
  //   {
  //     x: container.offsetWidth / 2,
  //     y: container.offsetHeight / 2
  //   }
  // }

  onDragEnd()
  {
    this.props.onDragEnd();
  }


  handleMouseEnter()
  {
    this.props.onMouseEnter(this.props.unit);
  }
  handleMouseLeave()
  {
    this.props.onMouseLeave();
  }
  private handleMouseUp(): void
  {
    this.props.onMouseUp(this.props.unit);
  }


  makeCell(type: string)
  {
    const unit = this.props.unit;
    const cellProps: React.HTMLProps<HTMLTableCellElement> = {};
    cellProps.key = type;
    cellProps.className = "unit-list-item-cell" + " unit-list-" + type;

    let cellContent: string | number | React.ReactElement<any>;

    switch (type)
    {
      case "strength":
      {
        cellContent = UnitStrength(
        {
          maxHealth: this.props.maxHealth,
          currentHealth: this.props.currentHealth,
          isSquadron: true,
        });

        break;
      }
      case "attack":
      case "defence":
      case "intelligence":
      case "speed":
      {
        cellContent = this.props[type];

        if (unit.attributes[type] < unit.baseAttributes[type])
        {
          cellProps.className += " lowered-stat";
        }
        else if (unit.attributes[type] > unit.baseAttributes[type])
        {
          cellProps.className += " raised-stat";
        }

        break;
      }
      default:
      {
        cellContent = this.props[type];

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  render(): React.ReactElement<any>
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    const rowProps: React.HTMLAttributes<HTMLTableRowElement> =
    {
      className: "unit-list-item",
      onClick : this.props.handleClick,
    };

    if (this.props.isDraggable && !this.props.isUnavailable)
    {
      rowProps.className += " draggable";
      rowProps.onTouchStart = rowProps.onMouseDown =
        this.dragPositioner.handleReactDownEvent;
    }


    if (this.props.isSelected)
    {
      rowProps.className += " selected-unit";
    };
    if (this.props.isReserved)
    {
      rowProps.className += " reserved-unit";
    }
    if (this.props.isUnavailable)
    {
      rowProps.className += " unavailable-unit";
    }
    if (this.props.isHovered)
    {
      rowProps.className += " unit-list-item-hovered";
    }
    if (this.props.onMouseEnter && this.props.onMouseLeave)
    {
      rowProps.onMouseEnter = this.handleMouseEnter;
      rowProps.onMouseLeave = this.handleMouseLeave;
    }
    if (this.props.onMouseUp)
    {
      rowProps.onMouseUp = this.handleMouseUp;
    }


    return(
      React.DOM.tr(rowProps,
        cells,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitListItemComponent);
export default Factory;
