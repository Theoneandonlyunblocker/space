/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitListItem";
  mixins: reactTypeTODO_any = [Draggable];

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
    if (this.needsFirstTouchUpdate && this.refs.dragClone)
    {
      var node = this.refs.dragClone.getDOMNode();
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
    if (!this.refs.dragClone) return;

    var node = this.refs.dragClone.getDOMNode();
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
        cellContent = UIComponents.UnitStrength(
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
        UIComponents.Unit(
        {
          ref: "dragClone",
          unit: unit
        })
      );
    }


    var cells: any = [];

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
