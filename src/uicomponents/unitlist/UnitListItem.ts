/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts" />


import Unit from "../../Unit";
import UnitStrength from "../unit/UnitStrength";
import ListColumn from "./ListColumn";
import {default as UnitComponentFactory, UnitComponent} from "../unit/Unit";


interface PropTypes extends React.Props<any>
{
  onDragEnd: (dropSuccesful?: boolean) => void;
  onDragStart: (unit: Unit) => void;
  onMouseLeave: () => void;
  hasNoActionsLeft: boolean;
  isHovered: boolean;
  isDraggable: boolean;
  currentHealth: number;
  isReserved: boolean;
  isSelected: boolean;
  onMouseEnter: (unit: Unit) => void;
  maxHealth: number;
  activeColumns: ListColumn[];
  unit: Unit;
  handleClick: () => void;
}

interface StateType
{
  dragging?: boolean;
}
export class UnitListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitListItem";
  // mixins = [Draggable];

  state: StateType;
  needsFirstTouchUpdate: boolean = true;
  ref_TODO_dragClone: UnitComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.makeCell = this.makeCell.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);    
  }
  
  componentDidMount()
  {
    if (!this.props.isDraggable) return;

    var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    this.forcedDragOffset =
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2
    }
  }

  componentDidUpdate()
  {
    if (this.needsFirstTouchUpdate && this.ref_TODO_dragClone)
    {
      var node = React.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
      node.classList.add("draggable");
      node.classList.add("dragging");

      var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

      node.style.width = "" + container.offsetWidth + "px";
      node.style.height = "" + container.offsetHeight + "px";

      this.needsFirstTouchUpdate = false;
    }
  }

  onDragStart()
  {
    this.props.onDragStart(this.props.unit);
  }

  onDragMove(x: number, y: number)
  {
    if (!this.ref_TODO_dragClone) return;

    var node = React.findDOMNode<HTMLElement>(this.ref_TODO_dragClone);
    node.classList.add("draggable");
    node.classList.add("dragging");
    node.style.left = "" + x + "px";
    node.style.top = "" + y + "px";

    var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

    node.style.width = "" + container.offsetWidth + "px";
    node.style.height = "" + container.offsetHeight + "px";


    this.forcedDragOffset =
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2
    }
  }

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
    var unit = this.props.unit;
    var columns = this.props.activeColumns;

    if (this.state.dragging)
    {
      return(
        UnitComponentFactory(
        {
          ref: (component: UnitComponent) =>
          {
            this.ref_TODO_dragClone = component;
          },
          unit: unit,
          facesLeft: true
        })
      );
    }


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
        this.handleMouseDown;
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
