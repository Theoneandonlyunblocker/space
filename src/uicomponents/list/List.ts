/// <reference path="../../../lib/react-global.d.ts" />

import eventManager from "../../eventManager";

import ListItem from "./ListItem";
import ListColumn from "./ListColumn";
import ListOrder from "./ListOrder";

import
{
  shallowCopy
} from "../../utility";

interface PropTypes extends React.Props<any>
{
  initialColumns: ListColumn[];
  listItems: ListItem[];
  initialSortOrder?: ListColumn[];
  keyboardSelect?: boolean; // boolean = false
  initialSelected?: ListItem;
  tabIndex?: number; // number = 1
  noHeader?: boolean; // boolean = false
  addSpacer?: boolean; // boolean = false
  onRowChange?: (row: ListItem) => void;
  colStylingFN?: (column: ListColumn, props: any) => any;
  autoSelect?: boolean;
}

interface StateType
{
  columns?: ListColumn[];
  selectedColumn?: ListColumn;
  columnSortingOrder?: ListColumn[]; // Sort by month->day->year etc.
  sortingOrderForColumnKey?: {[columnKey: string]: ListOrder}; // day: asc, month: asc, year: desc
  selected?: ListItem;
}

export class ListComponent extends React.Component<PropTypes, StateType>
{
  sortedItems: ListItem[];
  state: StateType;
  
  ref_TODO_header: HTMLElement;
  ref_TODO_inner: HTMLElement;

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
    const initialColumn: ListColumn = this.props.initialSortOrder ?
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
      sortingOrderForColumnKey: sortingOrderForColumnKey
    });
  }

  componentDidMount()
  {
    var self = this;

    window.addEventListener("resize", this.setDesiredHeight, false);
    eventManager.addEventListener("popupResized", this.setDesiredHeight);

    if (this.props.keyboardSelect)
    {
      ReactDOM.findDOMNode(this).addEventListener("keydown", function(event: KeyboardEvent)
      {
        switch (event.keyCode)
        {
          case 40:
          {
            self.shiftSelection(1);
            break;
          }
          case 38:
          {
            self.shiftSelection(-1);
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
    var ownNode = ReactDOM.findDOMNode<HTMLElement>(this);
    var innerNode = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_inner);

    ownNode.style.height = "auto";
    innerNode.style.height = "auto";

    var parentHeight = ownNode.parentElement.getBoundingClientRect().height;
    var ownRect = ownNode.getBoundingClientRect();
    var ownHeight = ownRect.height;


    var strippedOwnHeight = parseInt(getComputedStyle(ownNode).height)
    var extraHeight = ownHeight - strippedOwnHeight;

    var desiredHeight = parentHeight - extraHeight;

    var maxHeight = window.innerHeight - ownRect.top - extraHeight;

    desiredHeight = Math.min(desiredHeight, maxHeight);

    ownNode.style.height = "" + desiredHeight + "px";
    innerNode.style.height = "" + desiredHeight + "px";
  }

  handleScroll(e: React.UIEvent)
  {
    // scrolls header to match list contents
    var target = <Element> e.target;
    var header = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_header);
    var titles = <NodeListOf<HTMLElement>> header.getElementsByClassName("fixed-table-th-inner");

    var marginString = "-" + target.scrollLeft + "px";

    for (let i = 0; i < titles.length; i++)
    {
      titles[i].style.marginLeft = marginString;
    }
  }

  makeInitialSortingOrder(columns: ListColumn[], initialColumn: ListColumn)
  {
    var initialSortOrder = this.props.initialSortOrder;
    if (!initialSortOrder || initialSortOrder.length < 1)
    {
      initialSortOrder = [initialColumn];
    }


    var order = initialSortOrder;


    for (let i = 0; i < columns.length; i++)
    {
      if (initialSortOrder.indexOf(columns[i]) < 0)
      {
        order.push(columns[i]);
      }
    }

    return order;
  }

  getNewSortingOrder(newColumn: ListColumn)
  {
    var order = this.state.columnSortingOrder.slice(0);
    var current = order.indexOf(newColumn);

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
      throw new Error("Invalid list order: " + order);
    }
  }
  private getSortingOrderForColumnKeyWithColumnReversed(columnToReverse: ListColumn)
  {
    const copied = shallowCopy(this.state.sortingOrderForColumnKey);
    copied[columnToReverse.key] = ListComponent.reverseListOrder(copied[columnToReverse.key]);
    
    return copied;
  }
  handleSelectColumn(column: ListColumn)
  {
    if (column.notSortable)
    {
      return;
    }
    
    const stateObj: StateType =
    {
      selectedColumn: column,
      columnSortingOrder: this.getNewSortingOrder(column)
    };

    if (this.state.selectedColumn.key === column.key)
    {
      stateObj.sortingOrderForColumnKey = this.getSortingOrderForColumnKeyWithColumnReversed(column);
    }
    
    this.setState(stateObj);
  }

  handleSelectRow(row: ListItem)
  {
    if (this.props.onRowChange && row) this.props.onRowChange.call(null, row);

    this.setState(
    {
      selected: row
    });
  }

  private getSortedItems(): ListItem[]
  {
    const sortingFunctions:
    {
      [key: string]: (a: ListItem, b: ListItem) => number;
    } = {};
    function makeSortingFunction(column: ListColumn)
    {
      if (column.sortingFunction)
      {
        return column.sortingFunction;
      }

      var propToSortBy = column.propToSortBy || column.key;

      return (function (a: ListItem, b: ListItem)
      {
        var a1 = a.data_LISTTODO[propToSortBy];
        var b1 = b.data_LISTTODO[propToSortBy];

        if (a1 > b1) return 1;
        else if (a1 < b1) return -1;
        else return 0;
      })
    }
    function getSortingFunction(column: ListColumn)
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
      // const keySortingResult = a.key > b.key ? 1 : -1;
      // if (this.state.sortingOrderForColumnKey[this.state.selectedColumn.key] === "desc")
      // {
      //   return -1 * keySortingResult;
      // }
      // else
      // {
      //   return keySortingResult;
      // }
    });
    
    return sortedItems;
  }

  shiftSelection(amountToShift: number)
  {
    var reverseIndexes = {};
    for (let i = 0; i < this.sortedItems.length; i++)
    {
      reverseIndexes[this.sortedItems[i].key] = i;
    };
    var currSelectedIndex = reverseIndexes[this.state.selected.key];
    var nextIndex = (currSelectedIndex + amountToShift) % this.sortedItems.length;
    if (nextIndex < 0)
    {
      nextIndex += this.sortedItems.length;
    }

    this.handleSelectRow(this.sortedItems[nextIndex]);
  }
  render()
  {
    var columns: React.ReactHTMLElement<any>[] = [];
    var headerLabels: React.ReactHTMLElement<any>[] = [];

    this.state.columns.forEach(column =>
    {
      var colProps: any =
      {
        key: column.key
      };

      if (this.props.colStylingFN)
      {
        colProps = this.props.colStylingFN(column, colProps);
      }

      columns.push(
        React.DOM.col(colProps)
      );

      var sortStatus: string = "";

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
            key: column.key
          },
          React.DOM.div(
            {
              className: "fixed-table-th-inner"
            },
            React.DOM.div(
            {
              className: "fixed-table-th-content" + sortStatus,
              title: column.title || colProps.title || null,
              onMouseDown: this.handleSelectColumn.bind(null, column),
              onTouchStart: this.handleSelectColumn.bind(null, column),
            },
              column.label
            )
          )
        )
      );
    });

    var sortedItems = this.getSortedItems();
    
    var rows: React.ReactElement<any>[] = [];

    sortedItems.forEach((item, i) =>
    {
      item.content.props.activeColumns = this.state.columns;
      item.content.props.handleClick = this.handleSelectRow.bind(null, item);

      rows.push(item.content);
      
      if (this.props.addSpacer && i < sortedItems.length - 1)
      {
        rows.push(React.DOM.tr(
        {
          className: "list-spacer",
          key: "spacer" + i
        },
          React.DOM.td(
          {
            colSpan: 20
          },
            null
          )
        ))
      }
    });



    return(
      React.DOM.div(
        {
          className: "fixed-table-container" + (this.props.noHeader ? " no-header" : ""),
          tabIndex: isFinite(this.props.tabIndex) ? this.props.tabIndex : 1
        },
        React.DOM.div({className: "fixed-table-header-background"}),
        React.DOM.div(
        {
          className: "fixed-table-container-inner",
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_inner = component;
          },
          onScroll: this.handleScroll
        },
          React.DOM.table(
          {
            className: "react-list"
          },
            React.DOM.colgroup(null,
              columns
            ),

            React.DOM.thead({className: "fixed-table-actual-header", ref: (component: HTMLElement) =>
            {
              this.ref_TODO_header = component;
            }},
              React.DOM.tr(null,
                headerLabels
              )
            ),

            React.DOM.thead({className: "fixed-table-hidden-header"},
              React.DOM.tr(null,
                headerLabels
              )
            ),

            React.DOM.tbody(null,
              rows
            )
          )
        )
      )
    );
  }
  
}

const Factory: React.Factory<PropTypes> = React.createFactory(ListComponent);
export default Factory;
