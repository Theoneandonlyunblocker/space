/// <reference path="../mixins/splitmultilinetext.ts" />

export namespace UIComponents
{
  export interface IListColumn
  {
    label: string;
    title?: string;
    key: string;
    defaultOrder?: string; // optional only if notSortable = true
    order?: string; // dont set this manually

    notSortable?: boolean;
    propToSortBy?: string;
    sortingFunction?: <T>(a: T, b: T) => number;
  }
  export interface IListItem
  {
    key: string | number;
    data: any;
  }
  export var List = React.createFactory(React.createClass({
    displayName: "List",
    mixins: [SplitMultilineText],

    sortedItems: [], // IListItem[]

    propTypes:
    {
      initialColumns: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // IListColumn[]
      listItems: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // IListItem[]
      initialSortOrder: React.PropTypes.arrayOf(React.PropTypes.object), // IListColumn[]
      keyboardSelect: React.PropTypes.bool, // boolean = false
      initialSelected: React.PropTypes.object, // IListItem
      tabIndex: React.PropTypes.number, // number = 1
      noHeader: React.PropTypes.bool, // boolean = false
      addSpacer: React.PropTypes.bool, // boolean = false
      onRowChange: React.PropTypes.func, // (row: IListItem) => void
      colStylingFN: React.PropTypes.func // (column: IListColumn, props: any) => any
    },

    getInitialState: function()
    {
      var initialColumn: IListColumn = this.props.initialSortOrder ?
        this.props.initialSortOrder[0] :
        this.props.initialColumns[0];

      return(
      {
        columns: this.props.initialColumns,
        selected: null, // set in componentDidMount
        selectedColumn: initialColumn,
        sortingOrder: this.makeInitialSortingOrder(this.props.initialColumns, initialColumn)
      });
    },

    componentDidMount: function()
    {
      var self = this;

      window.addEventListener("resize", this.setDesiredHeight, false);
      eventManager.addEventListener("popupResized", this.setDesiredHeight);

      if (this.props.keyboardSelect)
      {
        this.getDOMNode().addEventListener("keydown", function(event: KeyboardEvent)
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
        this.getDOMNode().focus();
      }
      else
      {
        this.setState({selected: this.sortedItems[0]});
      }
    },

    componentWillUnmount: function()
    {
      window.removeEventListener("resize", this.setDesiredHeight);
      eventManager.removeEventListener("popupResized", this.setDesiredHeight);
    },

    componentDidUpdate: function()
    {
      this.setDesiredHeight();
    },

    setDesiredHeight: function()
    {
      var ownNode = this.getDOMNode();
      var innerNode = this.refs.inner.getDOMNode();

      ownNode.style.height = "auto";
      innerNode.style.height = "auto";

      var parentHeight = ownNode.parentNode.getBoundingClientRect().height;
      var ownRect = ownNode.getBoundingClientRect();
      var ownHeight = ownRect.height;


      var strippedOwnHeight = parseInt(getComputedStyle(ownNode).height)
      var extraHeight = ownHeight - strippedOwnHeight;

      var desiredHeight = parentHeight - extraHeight;

      var maxHeight = window.innerHeight - ownRect.top - extraHeight;

      desiredHeight = Math.min(desiredHeight, maxHeight);

      ownNode.style.height = "" + desiredHeight + "px";
      innerNode.style.height = "" + desiredHeight + "px";
    },

    handleScroll: function(e: React.UIEvent)
    {
      // scrolls header to match list contents
      var target = <Element> e.target;
      var header = this.refs.header.getDOMNode();
      var titles = header.getElementsByClassName("fixed-table-th-inner");

      var marginString = "-" + target.scrollLeft + "px";

      for (var i = 0; i < titles.length; i++)
      {
        titles[i].style.marginLeft = marginString;
      }
    },

    makeInitialSortingOrder: function(columns: IListColumn[], initialColumn: IListColumn)
    {
      var initialSortOrder = this.props.initialSortOrder;
      if (!initialSortOrder || initialSortOrder.length < 1)
      {
        initialSortOrder = [initialColumn];
      }


      var order = initialSortOrder;


      for (var i = 0; i < columns.length; i++)
      {
        if (!columns[i].order)
        {
          columns[i].order = columns[i].defaultOrder;
        }
        if (initialSortOrder.indexOf(columns[i]) < 0)
        {
          order.push(columns[i]);
        }
      }

      return order;
    },

    getNewSortingOrder: function(newColumn: IListColumn)
    {
      var order = this.state.sortingOrder.slice(0);
      var current = order.indexOf(newColumn);

      if (current >= 0)
      {
        order.splice(current);
      }

      order.unshift(newColumn);

      return order;
    },

    handleSelectColumn: function(column: IListColumn)
    {
      if (column.notSortable) return;
      function getReverseOrder(order: string)
      {
        return order === "desc" ? "asc" : "desc";
      }

      if (this.state.selectedColumn.key === column.key)
      {
        column.order = getReverseOrder(column.order);
        this.forceUpdate();
      }
      else
      {
        column.order = column.defaultOrder;
        this.setState(
        {
          selectedColumn: column,
          sortingOrder: this.getNewSortingOrder(column)
        })
      }
    },

    handleSelectRow: function(row: IListItem)
    {
      if (this.props.onRowChange && row) this.props.onRowChange.call(null, row);

      this.setState(
      {
        selected: row
      });
    },

    sort: function()
    {
      var itemsToSort = this.props.listItems;
      var columnsToTry = this.state.columns;
      var sortOrder = this.state.sortingOrder;
      var sortFunctions:
      {
        [key: string]: any;
      } = {};


      function makeSortingFunction(column: IListColumn)
      {
        if (column.sortingFunction) return column.sortingFunction;

        var propToSortBy = column.propToSortBy || column.key;

        return (function (a: IListItem, b: IListItem)
        {
          var a1 = a.data[propToSortBy];
          var b1 = b.data[propToSortBy];

          if (a1 > b1) return 1;
          else if (a1 < b1) return -1;
          else return 0;
        })
      }

      itemsToSort.sort(function(a: IListItem, b: IListItem)
      {
        var result = 0;
        for (var i = 0; i < sortOrder.length; i++)
        {
          var columnToSortBy = sortOrder[i];

          if (!sortFunctions[columnToSortBy.key])
          {
            sortFunctions[columnToSortBy.key] = makeSortingFunction(columnToSortBy);
          }
          var sortFunction = sortFunctions[columnToSortBy.key];

          result = sortFunction(a, b);

          if (columnToSortBy.order === "desc")
          {
            result *= -1;
          }

          if (result) return result;
        }

        return 0; // couldnt sort
      });

      this.sortedItems = itemsToSort;
    },

    shiftSelection: function(amountToShift: number)
    {
      var reverseIndexes = {};
      for (var i = 0; i < this.sortedItems.length; i++)
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
    },
    render: function()
    {
      var self = this;
      var columns: ReactDOMPlaceHolder[] = [];
      var headerLabels: ReactDOMPlaceHolder[] = [];

      this.state.columns.forEach(function(column: IListColumn)
      {
        var colProps: any =
        {
          key: column.key
        };

        if (self.props.colStylingFN)
        {
          colProps = self.props.colStylingFN(column, colProps);
        }

        columns.push(
          React.DOM.col(colProps)
        );

        var sortStatus: string = "";

        if (!column.notSortable) sortStatus = " sortable";

        if (self.state.selectedColumn.key === column.key)
        {
          sortStatus += " sorted-" + column.order;
        }
        else if (!column.notSortable) sortStatus += " unsorted";

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
                onMouseDown: self.handleSelectColumn.bind(null, column),
                onTouchStart: self.handleSelectColumn.bind(null, column),
              },
                column.label
              )
            )
          )
        );
      });

      this.sort();

      var sortedItems: IListItem[] = this.sortedItems;
      
      var rows: ReactDOMPlaceHolder[] = [];

      sortedItems.forEach(function(item: IListItem, i: number)
      {
        item.data.key = item.key;
        item.data.activeColumns = self.state.columns;
        item.data.handleClick = self.handleSelectRow.bind(null, item);
        var row = item.data.rowConstructor(item.data);

        rows.push(
          row
        );
        if (self.props.addSpacer && i < sortedItems.length - 1)
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
            ref: "inner",
            onScroll: this.handleScroll
          },
            React.DOM.table(
            {
              className: "react-list"
            },
              React.DOM.colgroup(null,
                columns
              ),

              React.DOM.thead({className: "fixed-table-actual-header", ref: "header"},
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
    
  }));
}
