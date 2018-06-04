import * as React from "react";
import * as ReactDOM from "react-dom";

import eventManager from "../../eventManager";
import
{
  shallowCopy,
} from "../../utility";

import ListColumn from "./ListColumn";
import ListItem from "./ListItem";
import ListOrder from "./ListOrder";


export interface PropTypes extends React.Props<any>
{
  initialColumns: ListColumn<any>[];
  listItems: ListItem<any>[];
  initialSortOrder?: ListColumn<any>[];
  keyboardSelect?: boolean; // boolean = false
  initialSelected?: ListItem<any> | null;
  tabIndex?: number; // number = 1
  noHeader?: boolean; // boolean = false
  addSpacer?: boolean; // boolean = false
  onRowChange?: (row: ListItem<any>) => void;
  colStylingFN?: (column: ListColumn<any>, props: React.HTMLProps<HTMLTableColElement>) => React.HTMLProps<HTMLTableColElement>;
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

export class ListComponent extends React.Component<PropTypes, StateType>
{
  sortedItems: ListItem<any>[];
  public state: StateType;

  private headerElement: HTMLElement;
  private innerElement: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.getNewSortingOrder = this.getNewSortingOrder.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.makeInitialSortingOrder = this.makeInitialSortingOrder.bind(this);
    this.shiftSelection = this.shiftSelection.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.setDesiredHeight = this.setDesiredHeight.bind(this);
    this.handleSelectColumn = this.handleSelectColumn.bind(this);
    this.getSortedItems = this.getSortedItems.bind(this);
  }

  getInitialStateTODO(): StateType
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

  componentDidMount()
  {
    window.addEventListener("resize", this.setDesiredHeight, false);
    // TODO 2017.07.04 | do this some other way
    eventManager.addEventListener("popupResized", this.setDesiredHeight);

    if (this.props.keyboardSelect)
    {
      ReactDOM.findDOMNode<HTMLDivElement>(this).addEventListener("keydown", (event: KeyboardEvent) =>
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
      ReactDOM.findDOMNode<HTMLElement>(this).focus();
    }
    else
    {
      this.setState({selected: this.sortedItems[0]});
    }
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.setDesiredHeight);
    eventManager.removeEventListener("popupResized", this.setDesiredHeight);
  }

  componentDidUpdate()
  {
    this.setDesiredHeight();
  }

  setDesiredHeight()
  {
    const ownNode = ReactDOM.findDOMNode<HTMLElement>(this);
    const innerNode = ReactDOM.findDOMNode<HTMLElement>(this.innerElement);

    ownNode.style.height = "auto";
    innerNode.style.height = "auto";

    const parentHeight = ownNode.parentElement.getBoundingClientRect().height;
    const ownRect = ownNode.getBoundingClientRect();
    const ownHeight = ownRect.height;


    const strippedOwnHeight = parseInt(getComputedStyle(ownNode).height);
    const extraHeight = ownHeight - strippedOwnHeight;

    let desiredHeight = parentHeight - extraHeight;

    const maxHeight = window.innerHeight - ownRect.top - extraHeight;

    desiredHeight = Math.min(desiredHeight, maxHeight);

    ownNode.style.height = "" + desiredHeight + "px";
    innerNode.style.height = "" + desiredHeight + "px";
  }

  handleScroll(e: React.UIEvent<HTMLDivElement>)
  {
    // scrolls header to match list contents
    const target = e.currentTarget;
    const header = ReactDOM.findDOMNode<HTMLElement>(this.headerElement);
    const titles = <NodeListOf<HTMLElement>> header.getElementsByClassName("fixed-table-th-inner");

    const marginString = "-" + target.scrollLeft + "px";

    for (let i = 0; i < titles.length; i++)
    {
      titles[i].style.marginLeft = marginString;
    }
  }

  makeInitialSortingOrder(columns: ListColumn<any>[], initialColumn: ListColumn<any>)
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

  getNewSortingOrder(newColumn: ListColumn<any>)
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
  private getSortingOrderForColumnKeyWithColumnReversed(columnToReverse: ListColumn<any>)
  {
    const copied = shallowCopy(this.state.sortingOrderForColumnKey);
    copied[columnToReverse.key] = ListComponent.reverseListOrder(copied[columnToReverse.key]);

    return copied;
  }
  handleSelectColumn(column: ListColumn<any>)
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

  handleSelectRow(row: ListItem<any>)
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

  shiftSelection(amountToShift: number)
  {
    const reverseIndexes = {};
    for (let i = 0; i < this.sortedItems.length; i++)
    {
      reverseIndexes[this.sortedItems[i].key] = i;
    };
    const currSelectedIndex = reverseIndexes[this.state.selected.key];
    let nextIndex = (currSelectedIndex + amountToShift) % this.sortedItems.length;
    if (nextIndex < 0)
    {
      nextIndex += this.sortedItems.length;
    }

    this.handleSelectRow(this.sortedItems[nextIndex]);
  }
  render()
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
        React.DOM.col(colProps),
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
        React.DOM.th(
          {
            key: column.key,
          },
          React.DOM.div(
            {
              className: "fixed-table-th-inner",
            },
            React.DOM.div(
            {
              className: "fixed-table-th-content" + sortStatus,
              title: column.title || colProps.title || null,
              onMouseDown: this.handleSelectColumn.bind(null, column),
              onTouchStart: this.handleSelectColumn.bind(null, column),
            },
              column.label,
            ),
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
        rows.push(React.DOM.tr(
        {
          className: "list-spacer",
          key: "spacer" + i,
        },
          React.DOM.td(
          {
            colSpan: 20,
          },
            null,
          ),
        ));
      }
    });



    return(
      React.DOM.div(
        {
          className: "fixed-table-container" + (this.props.noHeader ? " no-header" : ""),
          tabIndex: isFinite(this.props.tabIndex) ? this.props.tabIndex : 1,
        },
        React.DOM.div({className: "fixed-table-header-background"}),
        React.DOM.div(
        {
          className: "fixed-table-container-inner",
          ref: (component: HTMLElement) =>
          {
            this.innerElement = component;
          },
          onScroll: this.handleScroll,
        },
          React.DOM.table(
          {
            className: "react-list",
          },
            React.DOM.colgroup(null,
              columns,
            ),

            React.DOM.thead({className: "fixed-table-actual-header", ref: (component: HTMLElement) =>
            {
              this.headerElement = component;
            }},
              React.DOM.tr(null,
                headerLabels,
              ),
            ),

            React.DOM.thead({className: "fixed-table-hidden-header"},
              React.DOM.tr(null,
                headerLabels,
              ),
            ),

            React.DOM.tbody(null,
              rows,
            ),
          ),
        ),
      )
    );
  }

}

const factory: React.Factory<PropTypes> = React.createFactory(ListComponent);
export default factory;
