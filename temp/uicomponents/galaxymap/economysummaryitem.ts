/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class EconomySummaryItem extends React.Component<PropTypes, {}>
{
  displayName: string = "EconomySummaryItem";

  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "economy-summary-item-cell" + " economy-summary-" + type;

    var cellContent: any;

    switch (type)
    {
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
      className: "economy-summary-item",
      onClick : this.props.handleClick
    };

    if (this.props.isSelected)
    {
      rowProps.className += " selected";
    };

    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}
