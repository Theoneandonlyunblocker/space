/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

import Unit from "../../Unit";
import UnitStrength from "../unit/UnitStrength";
import ListColumn from "./ListColumn";
import {default as UnitComponentFactory, UnitComponent} from "../unit/Unit";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

interface PropTypes extends React.Props<any>
{
  onMouseLeave: () => void;
  hasNoActionsLeft: boolean;
  isHovered: boolean;
  currentHealth: number;
  isReserved: boolean;
  isSelected: boolean;
  onMouseEnter: (unit: Unit) => void;
  maxHealth: number;
  activeColumns: ListColumn[];
  unit: Unit;
  handleClick: () => void;
  
  isDraggable: boolean;
  onDragEnd: (dropSuccesful?: boolean) => void;
  onDragStart: (unit: Unit) => void;
  dragPositionerProps?: DragPositionerProps;
}

interface StateType
{
}
export class UnitListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitListItem";
  
  state: StateType;
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
    this.makeCell = this.makeCell.bind(this);
    
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.makeDragClone = this.makeDragClone.bind(this);
    // this.onDragMove = this.onDragMove.bind(this);    
  }
  
  componentDidMount()
  {
    if (!this.props.isDraggable) return;

    var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    this.dragPositioner.forcedDragOffset =
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2
    }
  }

  // componentDidUpdate()
  // {
  //   if (this.dragPositioner.needsFirstTouchUpdate && this.ref_TODO_dragClone)
  //   {
  //     var node = React.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
  //     node.classList.add("draggable");
  //     node.classList.add("dragging");

  //     var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

  //     node.style.width = "" + container.offsetWidth + "px";
  //     node.style.height = "" + container.offsetHeight + "px";

  //     this.dragPositioner.needsFirstTouchUpdate = false;
  //   }
  // }

  onDragStart()
  {
    this.props.onDragStart(this.props.unit);
  }
  makeDragClone()
  {
    const container = document.createElement("div");
    
    React.render(
      UnitComponentFactory(
      {
        unit: this.props.unit,
        facesLeft: true,
      }),
      container
    );
    
    const renderedElement = <HTMLElement> container.firstChild;
    const wrapperElement = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];
    
    renderedElement.classList.add("draggable", "dragging");
    
    renderedElement.style.width = "" + wrapperElement.offsetWidth + "px";
    renderedElement.style.height = "" + wrapperElement.offsetHeight + "px";
    this.dragPositioner.forcedDragOffset =
    {
      x: wrapperElement.offsetWidth / 2,
      y: wrapperElement.offsetHeight / 2
    }
    
    return renderedElement;
  }
  // onDragMove(x: number, y: number)
  // {
  //   if (!this.ref_TODO_dragClone) return;

  //   var node = React.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
  //   node.classList.add("draggable");
  //   node.classList.add("dragging");
  //   node.style.left = "" + x + "px";
  //   node.style.top = "" + y + "px";

  //   var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

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


  makeCell(type: string)
  {
    var unit = this.props.unit;
    var cellProps: React.HTMLAttributes = {};
    cellProps.key = type;
    cellProps.className = "unit-list-item-cell" + " unit-list-" + type;

    var cellContent: string | number | React.ReactElement<any>;

    switch (type)
    {
      case "strength":
      {
        cellContent = UnitStrength(
        {
          maxHealth: this.props.maxHealth,
          currentHealth: this.props.currentHealth,
          isSquadron: true
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
          cellProps.className += " lowered-stat"
        }
        else if (unit.attributes[type] > unit.baseAttributes[type])
        {
          cellProps.className += " raised-stat"
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
    var columns = this.props.activeColumns;

    var cells: React.ReactElement<any>[] = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: React.HTMLAttributes =
    {
      className: "unit-list-item",
      onClick : this.props.handleClick
    };

    if (this.props.isDraggable && !this.props.hasNoActionsLeft)
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
    if (this.props.isHovered)
    {
      rowProps.className += " unit-list-item-hovered";
    }

    if (this.props.hasNoActionsLeft)
    {
      rowProps.className += " no-actions-left";
    }


    else if (this.props.onMouseEnter)
    {
      rowProps.onMouseEnter = this.handleMouseEnter;
      rowProps.onMouseLeave = this.handleMouseLeave;
    }


    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitListItemComponent);
export default Factory;
