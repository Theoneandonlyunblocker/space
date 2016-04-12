/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  playerMoney: any; // TODO refactor | define prop type 123
  handleClick: any; // TODO refactor | define prop type 123
  buildCost: any; // TODO refactor | define prop type 123
  activeColumns: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class ItemPurchaseListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ItemPurchaseListItem";
  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "item-purchase-list-item-cell " +
      "item-purchase-list-" + type;

    var cellContent: any;

    switch (type)
    {
      case ("buildCost"):
      {
        if (this.props.playerMoney < this.props.buildCost)
        {
          cellProps.className += " negative";
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
    var cells: React.HTMLElement[] = [];
    var columns = this.props.activeColumns;

    for (var i = 0; i < columns.length; i++)
    {
      cells.push(
        this.makeCell(columns[i].key)
      );
    }

    var props: any =
    {
      className: "item-purchase-list-item",
      onClick: this.props.handleClick
    }
    if (this.props.playerMoney < this.props.buildCost)
    {
      props.onClick = null;
      props.disabled = true;
      props.className += " disabled";
    }

    return(
      React.DOM.tr(props,
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ItemPurchaseListItemComponent);
export default Factory;
