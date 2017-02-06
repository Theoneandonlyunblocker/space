/// <reference path="../../../lib/react-global.d.ts" />

import ListItemProps from "../list/ListItemProps";
import Star from "../../Star";

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

    var cellContent: React.ReactNode;

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
      React.DOM.td(cellProps, cellContent)
    );
  }

  render()
  {
    var columns = this.props.activeColumns;

    var cells: React.ReactElement<any>[] = [];

    for (let i = 0; i < columns.length; i++)
    {
      var cell = this.makeCell(columns[i].key);

      cells.push(cell);
    }

    var rowProps =
    {
      className: "economy-summary-item",
      onClick : this.props.handleClick
    };

    // if (this.props.isSelected)
    // {
    //   rowProps.className += " selected";
    // };

    return(
      React.DOM.tr(rowProps,
        cells
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EconomySummaryItemComponent);
export default Factory;
