/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ItemListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "ItemListItem";
  mixins: reactTypeTODO_any = [Draggable];

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  onDragStart()
  {
    console.log("onDragStart", this.props.item.template.displayName);
    this.props.onDragStart(this.props.item);
  }
  onDragEnd()
  {
    this.props.onDragEnd();
  }

  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "item-list-item-cell" + " item-list-" + type;

    var cellContent: any;

    switch (type)
    {
      case "abilityName":
      {
        if (this.props.ability)
        {
          cellProps.title = this.props.ability.description;
          if (this.props.abilityIsPassive)
          {
            cellProps.className += " passive-skill";
          }
        }
      }
      default:
      {
        cellContent = this.props[type];
        if (isFinite(cellContent))
        {
          cellProps.className += " center-text"
        }

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  makeDragClone()
  {
    var clone = new Image();
    clone.src = this.props.item.template.icon;
    clone.className = "item-icon-base draggable dragging";

    return clone;
  }

  render()
  {
    var item = this.props.item;
    var columns = this.props.activeColumns;

    if (this.state.dragging && this.state.clone)
    {
      this.state.clone.style.left = "" + this.dragPos.left + "px";
      this.state.clone.style.top = "" + this.dragPos.top + "px";
    }

    var cells: any = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: any =
    {
      className: "item-list-item",
      onClick : this.props.handleClick,
      key: this.props.keyTODO/*TODO react*/
    };
    
    if (this.props.isDraggable)
    {
      rowProps.className += " draggable";
      rowProps.onTouchStart = rowProps.onMouseDown =
        this.handleMouseDown;
    }

    if (this.props.isSelected)
    {
      rowProps.className += " selected-item";
    };

    if (this.props.isReserved)
    {
      rowProps.className += " reserved-item";
    }



    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}
