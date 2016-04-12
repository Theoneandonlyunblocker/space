/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts" />


import Unit from "../../../src/Unit.ts";
import UnitStrength from "../unit/UnitStrength.ts";


interface PropTypes extends React.Props<any>
{
  onDragEnd: any; // TODO refactor | define prop type 123
  onDragStart: any; // TODO refactor | define prop type 123
  onMouseLeave: any; // TODO refactor | define prop type 123
  noActionsLeft: any; // TODO refactor | define prop type 123
  isHovered: boolean;
  isDraggable: boolean;
  currentHealth: any; // TODO refactor | define prop type 123
  isReserved: boolean;
  isSelected: boolean;
  onMouseEnter: any; // TODO refactor | define prop type 123
  maxHealth: number;
  activeColumns: ListColumn[];
  unit: Unit;
  handleClick: any; // TODO refactor | define prop type 123
}

interface StateType
{
  dragging?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  dragClone: React.Component<any, any>; // TODO refactor | correct ref type 542 | Unit
}

export class UnitListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitListItem";
  mixins: reactTypeTODO_any = [Draggable];

  state: StateType;
  refsTODO: RefTypes;

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
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "unit-list-item-cell" + " unit-list-" + type;

    var cellContent: any;

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

  render(): any
  {
    var unit = this.props.unit;
    var columns = this.props.activeColumns;

    if (this.state.dragging)
    {
      return(
        Unit(
        {
          ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_dragClone = component;
},
          unit: unit
        })
      );
    }


    var cells: React.ReactElement<any>[] = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: any =
    {
      className: "unit-list-item",
      onClick : this.props.handleClick
    };

    if (this.props.isDraggable && !this.props.noActionsLeft)
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

    if (this.props.noActionsLeft)
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
