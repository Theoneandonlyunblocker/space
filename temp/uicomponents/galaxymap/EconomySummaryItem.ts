/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  handleClick: any; // TODO refactor | define prop type 123
  isSelected: boolean;
  activeColumns: ListColumn[];
}

interface StateType
{
}

export class EconomySummaryItemComponent extends React.Component<PropTypes, StateType>
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

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeCell = this.makeCell.bind(this);    
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

const Factory: React.Factory<PropTypes> = React.createFactory(EconomySummaryItemComponent);
export default Factory;
