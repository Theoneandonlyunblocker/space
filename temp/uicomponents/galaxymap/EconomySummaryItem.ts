/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import ListColumn from "../unitlist/Listcolumn.d.ts";
import Star from "../../../src/Star.ts";

interface PropTypes extends React.Props<any>
{
  handleClick: any; // TODO refactor | define prop type 123
  isSelected: boolean;
  activeColumns: ListColumn[];
  
  star: Star;
  id: number;
  name: string;
  income: number;
}

interface StateType
{
}

export class EconomySummaryItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "EconomySummaryItem";
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
  
  makeCell(type: string)
  {
    var cellProps =
    {
      key: type,
      className: "economy-summary-item-cell" + " economy-summary-" + type,
    };

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

    var cells: React.ReactElement<any>[] = [];

    for (var i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps =
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
