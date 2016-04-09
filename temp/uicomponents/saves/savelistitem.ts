/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class SaveListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "SaveListItem";

  handleDelete(e: React.MouseEvent)
  {
    e.stopPropagation();
    this.props.handleDelete();
  }
  handleUndoDelete(e: React.MouseEvent)
  {
    e.stopPropagation();
    this.props.handleUndoDelete();
  }
  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "save-list-item-cell" + " save-list-" + type;

    var cellContent: any;

    switch (type)
    {
      case "delete":
      {
        if (this.props.isMarkedForDeletion)
        {
          cellContent = "";
          cellProps.className += " undo-delete-button";
          cellProps.onClick = this.handleUndoDelete;
        }
        else
        {
          cellContent = "X";
          cellProps.onClick = this.handleDelete;
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

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var columns = this.props.activeColumns;

    var cells: any = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps: any =
    {
      className: "save-list-item",
      onClick : this.props.handleClick
    };

    if (this.props.isMarkedForDeletion)
    {
      rowProps.className += " marked-for-deletion";
    }

    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}
