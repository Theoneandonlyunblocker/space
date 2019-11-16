import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import
{
  shallowCopy,
} from "core/src/generic/utility";

import {ListColumn} from "./ListColumn";
import {ListItem} from "./ListItem";
import {ListOrder} from "./ListOrder";


export interface PropTypes<I> extends React.Props<any>
{
  initialColumns: ListColumn<I>[];
  listItems: ListItem<I>[];
  initialSortOrder?: ListColumn<I>[];
  keyboardSelect?: boolean; // boolean = false
  initialSelected?: ListItem<I> | null;
  tabIndex?: number; // number = 1
  noHeader?: boolean; // boolean = false
  addSpacer?: boolean; // boolean = false
  onRowChange?: (row: ListItem<I>) => void;
  colStylingFN?: (column: ListColumn<I>, props: React.HTMLProps<HTMLTableColElement>) => React.HTMLProps<HTMLTableColElement>;
  autoSelect?: boolean;
}

interface StateType
{
  columns: ListColumn<any>[];
  selectedColumn: ListColumn<any>;
  columnSortingOrder: ListColumn<any>[]; // Sort by month->day->year etc.
  sortingOrderForColumnKey: {[columnKey: string]: ListOrder}; // day: asc, month: asc, year: desc
  selected: ListItem<any> | null;
}

export class ListComponent extends React.Component<PropTypes<any>, StateType>
{
  public state: StateType;

  private sortedItems: ListItem<any>[];
  private readonly ownDOMNode = React.createRef<HTMLTableElement>();

  constructor(props: PropTypes<any>)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public componentDidMount()
  {
    if (this.props.keyboardSelect)
    {
      this.ownDOMNode.current.addEventListener("keydown", (event: KeyboardEvent) =>
      {
        switch (event.keyCode)
        {
          case 40:
          {
            this.shiftSelection(1);
            break;
          }
          case 38:
          {
            this.shiftSelection(-1);
            break;
          }
          default:
          {
            return;
          }
        }
      });
    }
    if (this.props.initialSelected)
    {
      this.handleSelectRow(this.props.initialSelected);
    }
    else if (this.props.autoSelect)
    {
      this.handleSelectRow(this.sortedItems[0]);
      this.ownDOMNode.current.focus();
    }
    else
    {
      this.setState({selected: this.sortedItems[0]});
    }
  }
  public render()
  {
    const columns: React.ReactHTMLElement<any>[] = [];
    const headerLabels: React.ReactHTMLElement<any>[] = [];

    this.state.columns.forEach(column =>
    {
      let colProps: React.HTMLProps<HTMLTableColElement> =
      {
        key: column.key,
      };

      if (this.props.colStylingFN)
      {
        colProps = this.props.colStylingFN(column, colProps);
      }

      columns.push(
        ReactDOMElements.col(colProps),
      );

      let sortStatus: string = "";

      if (!column.notSortable)
      {
        sortStatus = " sortable";
      }

      if (this.state.selectedColumn.key === column.key)
      {
        sortStatus += " sorted-" + this.state.sortingOrderForColumnKey[column.key];
      }
      else if (!column.notSortable)
      {
        sortStatus += " unsorted";
      }

      headerLabels.push(
        ReactDOMElements.th(
        {
          key: column.key,
          className: "fixed-table-header",
        },
          ReactDOMElements.div(
          {
            className: `fixed-table-th-content fixed-table-th-content-${column.key} ${sortStatus}`,
            title: column.title || colProps.title || null,
            onMouseDown: this.handleSelectColumn.bind(null, column),
            onTouchStart: this.handleSelectColumn.bind(null, column),
          },
            column.label,
          ),
        ),
      );
    });

    this.sortedItems = this.getSortedItems();

    const rows: React.ReactElement<any>[] = [];

    this.sortedItems.forEach((item, i) =>
    {
      rows.push(React.cloneElement(item.content,
      {
        key: item.key,
        activeColumns: this.state.columns,
        handleClick: this.handleSelectRow.bind(null, item),
      }));

      if (this.props.addSpacer && i < this.sortedItems.length - 1)
      {
        rows.push(ReactDOMElements.tr(
        {
          className: "list-spacer",
          key: "spacer" + i,
        },
          ReactDOMElements.td(
          {
            colSpan: 20,
          },
            null,
          ),
        ));
      }
    });



    return(
      ReactDOMElements.div(
      {
        className: "react-list-wrapper",
      },
        ReactDOMElements.table(
        {
          className: "react-list",
          ref: this.ownDOMNode,
          tabIndex: isFinite(this.props.tabIndex) ? this.props.tabIndex : 1,
        },
          ReactDOMElements.colgroup(null,
            columns,
          ),
          this.props.noHeader ? null :
            ReactDOMElements.thead(null,
              ReactDOMElements.tr(null,
                headerLabels,
              ),
            ),
          ReactDOMElements.tbody(null,
            rows,
          ),
        ),
      )
    );
  }

  private bindMethods()
  {
    this.getNewSortingOrder = this.getNewSortingOrder.bind(this);
    this.makeInitialSortingOrder = this.makeInitialSortingOrder.bind(this);
    this.shiftSelection = this.shiftSelection.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleSelectColumn = this.handleSelectColumn.bind(this);
    this.getSortedItems = this.getSortedItems.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    const initialColumn: ListColumn<any> = this.props.initialSortOrder ?
      this.props.initialSortOrder[0] :
      this.props.initialColumns[0];

    const sortingOrderForColumnKey: {[columnKey: string]: ListOrder} = {};
    this.props.initialColumns.forEach(column =>
    {
      sortingOrderForColumnKey[column.key] = column.defaultOrder;
    });

    return(
    {
      columns: this.props.initialColumns,
      selected: null, // set in componentDidMount
      selectedColumn: initialColumn,
      columnSortingOrder: this.makeInitialSortingOrder(this.props.initialColumns, initialColumn),
      sortingOrderForColumnKey: sortingOrderForColumnKey,
    });
  }
  private makeInitialSortingOrder(columns: ListColumn<any>[], initialColumn: ListColumn<any>)
  {
    let initialSortOrder = this.props.initialSortOrder;
    if (!initialSortOrder || initialSortOrder.length < 1)
    {
      initialSortOrder = [initialColumn];
    }


    const order = initialSortOrder;


    for (let i = 0; i < columns.length; i++)
    {
      if (initialSortOrder.indexOf(columns[i]) === -1)
      {
        order.push(columns[i]);
      }
    }

    return order;
  }
  private getNewSortingOrder(newColumn: ListColumn<any>)
  {
    const order = this.state.columnSortingOrder.slice(0);
    const current = order.indexOf(newColumn);

    if (current >= 0)
    {
      order.splice(current);
    }

    order.unshift(newColumn);

    return order;
  }
  private getSortingOrderForColumnKeyWithColumnReversed(columnToReverse: ListColumn<any>)
  {
    const copied = shallowCopy(this.state.sortingOrderForColumnKey);
    copied[columnToReverse.key] = ListComponent.reverseListOrder(copied[columnToReverse.key]);

    return copied;
  }
  private handleSelectColumn(column: ListColumn<any>)
  {
    if (column.notSortable)
    {
      return;
    }

    this.setState(
    {
      selectedColumn: column,
      columnSortingOrder: this.getNewSortingOrder(column),
      sortingOrderForColumnKey: this.state.selectedColumn.key === column.key ?
        this.getSortingOrderForColumnKeyWithColumnReversed(column) :
        this.state.sortingOrderForColumnKey,
    });
  }
  private handleSelectRow(row: ListItem<any>)
  {
    if (this.props.onRowChange && row)
    {
      this.props.onRowChange.call(null, row);
    }

    this.setState(
    {
      selected: row,
    });
  }
  private getSortedItems(): ListItem<any>[]
  {
    const sortingFunctions:
    {
      [key: string]: (a: ListItem<any>, b: ListItem<any>) => number;
    } = {};
    function makeSortingFunction(column: ListColumn<any>)
    {
      if (column.sortingFunction)
      {
        return column.sortingFunction;
      }
      else
      {
        return ((a: ListItem<any>, b: ListItem<any>) =>
        {
          const propToSortBy = column.propToSortBy || column.key;

          const vA = a.content.props[propToSortBy];
          const vB = b.content.props[propToSortBy];

          if (vA > vB)
          {
            return 1;
          }
          else if (vA < vB)
          {
            return -1;
          }
          else
          {
            if (a.key > b.key)
            {
              return 1;
            }
            else if (a.key < b.key)
            {
              return 0;
            }
            else
            {
              throw new Error(`Duplicate key ${a.key} for list items.`);
            }
          }
        });
      }
    }
    function getSortingFunction(column: ListColumn<any>)
    {
      if (!sortingFunctions[column.key])
      {
        sortingFunctions[column.key] = makeSortingFunction(column);
      }

      return sortingFunctions[column.key];
    }

    const sortedItems = this.props.listItems.slice(0).sort((a, b) =>
    {
      for (let i = 0; i < this.state.columnSortingOrder.length; i++)
      {
        const columnToSortBy = this.state.columnSortingOrder[i];
        const sortingFunction = getSortingFunction(columnToSortBy);
        const sortingResult = sortingFunction(a, b);

        if (sortingResult)
        {
          if (this.state.sortingOrderForColumnKey[columnToSortBy.key] === "desc")
          {
            return -1 * sortingResult;
          }
          else
          {
            return sortingResult;
          }
        }
      }

      const keySortingResult = a.key > b.key ? 1 : -1;
      if (this.state.sortingOrderForColumnKey[this.state.selectedColumn.key] === "desc")
      {
        return -1 * keySortingResult;
      }
      else
      {
        return keySortingResult;
      }
    });

    return sortedItems;
  }
  private shiftSelection(amountToShift: number)
  {
    const reverseIndexes = {};
    for (let i = 0; i < this.sortedItems.length; i++)
    {
      reverseIndexes[this.sortedItems[i].key] = i;
    }
    const currSelectedIndex = reverseIndexes[this.state.selected.key];
    let nextIndex = (currSelectedIndex + amountToShift) % this.sortedItems.length;
    if (nextIndex < 0)
    {
      nextIndex += this.sortedItems.length;
    }

    this.handleSelectRow(this.sortedItems[nextIndex]);
  }

  private static reverseListOrder(order: ListOrder): ListOrder
  {
    if (order === "asc")
    {
      return "desc";
    }
    else if (order === "desc")
    {
      return "asc";
    }
    else
    {
      throw new Error(`Invalid list order: ${order}`);
    }
  }
}

const factory: any = React.createFactory(ListComponent);
export function List<I>(props?: React.Attributes & PropTypes<I>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<I>>
{
  return factory(props, ...children);
}
