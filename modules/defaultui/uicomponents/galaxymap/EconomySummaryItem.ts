import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Star from "../../Star";
import ListItemProps from "../list/ListItemProps";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  // isSelected: boolean;

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
  public displayName = "EconomySummaryItem";
  public state: StateType;

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
    const cellProps =
    {
      key: type,
      className: "economy-summary-item-cell" + " economy-summary-" + type,
    };

    let cellContent: React.ReactNode;

    switch (type)
    {
      case "id":
      {
        cellContent = this.props.id;
        break;
      }
      case "name":
      {
        cellContent = this.props.name;
        break;
      }
      case "income":
      {
        cellContent = this.props.income;
        break;
      }
    }

    return(
      ReactDOMElements.td(cellProps, cellContent)
    );
  }

  render()
  {
    const columns = this.props.activeColumns;

    const cells: React.ReactElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      const cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    const rowProps =
    {
      className: "economy-summary-item",
      onClick : this.props.handleClick,
    };

    // if (this.props.isSelected)
    // {
    //   rowProps.className += " selected";
    // };

    return(
      ReactDOMElements.tr(rowProps,
        cells,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(EconomySummaryItemComponent);
export default factory;
