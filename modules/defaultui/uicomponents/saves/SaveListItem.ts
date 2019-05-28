import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import ListItemProps from "../list/ListItemProps";


export interface PropTypes extends ListItemProps, React.Props<any>
{
  isMarkedForDeletion: boolean;
  onUndoMarkForDeletion: (callback?: () => void) => void;
  onMarkForDeletion: () => void;
  onDoubleClick?: () => void;
  storageKey: string;
  name: string;
  date: string;

  accurateDate: string;
}

interface StateType
{
}

export class SaveListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SaveListItem";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleUndoMarkForDeletion = this.handleUndoMarkForDeletion.bind(this);
    this.handleMarkForDeletion = this.handleMarkForDeletion.bind(this);
    this.makeCell = this.makeCell.bind(this);
  }

  handleMarkForDeletion(e: React.MouseEvent<HTMLTableCellElement>)
  {
    e.stopPropagation();
    this.props.onMarkForDeletion();
  }
  handleUndoMarkForDeletion(e: React.MouseEvent<HTMLTableCellElement>)
  {
    e.stopPropagation();
    this.props.onUndoMarkForDeletion();
  }
  private static preventDefault(e: React.SyntheticEvent<any>)
  {
    e.preventDefault();
    e.stopPropagation();
  }
  makeCell(type: string)
  {
    const cellProps: React.HTMLProps<HTMLTableCellElement> = {};
    cellProps.key = type;
    cellProps.className = "save-list-item-cell" + " save-list-" + type;

    let cellContent: string;

    switch (type)
    {
      case "delete":
      {
        cellContent = "";
        cellProps.onDoubleClick = SaveListItemComponent.preventDefault;

        if (this.props.isMarkedForDeletion)
        {
          cellProps.className += " undo-delete-button";
          cellProps.onClick = this.handleUndoMarkForDeletion;
        }
        else
        {
          cellProps.onClick = this.handleMarkForDeletion;
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

    const rowProps: React.HTMLAttributes<HTMLTableRowElement> =
    {
      className: "save-list-item",
      onClick : this.props.handleClick,
      onDoubleClick: this.props.onDoubleClick,
    };

    if (this.props.isMarkedForDeletion)
    {
      rowProps.className += " marked-for-deletion";
    }

    return(
      ReactDOMElements.tr(rowProps,
        cells,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SaveListItemComponent);
export default factory;
