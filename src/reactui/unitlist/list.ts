/// <reference path="../mixins/splitmultilinetext.ts" />

module Rance
{
  export module UIComponents
  {
    
    /**
     * props:
     *   listItems
     *   initialColumns
     * 
     * state:
     *   selected
     *   columns
     *   sortBy
     *
     * children:
     *   listelement:
     *     key
     *     tr
     *     getData()
     *
     *  columns:
     *    props (classes etc)
     *    label
     *    sorting (alphabet, numeric, null)
     *    title?
     */

    export var List = React.createClass({
      displayName: "List",
      mixins: [SplitMultilineText],

      getInitialState: function()
      {
        var initialColumn = this.props.initialColumn ||
          this.props.initialColumns[0];

        var initialSelected = this.props.listItems[0];

        return(
        {
          columns: this.props.initialColumns,
          selected: initialSelected,
          sortBy:
          {
            column: initialColumn,
            order: initialColumn.defaultOrder || "desc",
            currColumnIndex: this.props.initialColumns.indexOf(initialColumn)
          }
        });
      },

      componentDidMount: function()
      {
        var self = this;

        this.handleSelectRow(this.props.sortedItems[0]);

        this.getDOMNode().addEventListener("keydown", function(event)
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
      },

      handleSelectColumn: function(column)
      {
        if (column.notSortable) return;
        var order;
        if (this.state.sortBy.column.key === column.key)
        {
          // flips order
          order = this.state.sortBy.order === "desc" ?
            "asc" :
            "desc";
        }
        else
        {
          order = column.defaultOrder;
        }

        this.setState(
        {
          sortBy:
          {
            column: column,
            order: order,
            currColumnIndex: this.state.columns.indexOf(column)
          }
        });
      },

      handleSelectRow: function(row)
      {
        if (this.props.onRowChange) this.props.onRowChange.call(null, row);

        this.setState(
        {
          selected: row
        });
      },

      sort: function()
      {
        var self = this;
        var selectedColumn = this.state.sortBy.column;

        var initialPropToSortBy = selectedColumn.propToSortBy || selectedColumn.key;

        var itemsToSort = this.props.listItems;

        var defaultSortFN = function(a, b)
        {
          var propToSortBy = initialPropToSortBy;
          var nextIndex = self.state.sortBy.currColumnIndex;

          for (var i = 0; i < self.state.columns.length; i++)
          {
            if (a.data[propToSortBy] === b.data[propToSortBy])
            {
              nextIndex = (nextIndex + 1) % self.state.columns.length;
              var nextColumn = self.state.columns[nextIndex];
              propToSortBy = nextColumn.propToSortBy || nextColumn.key;
            }
            else
            {
              break;
            }
          }

          return a.data[propToSortBy] > b.data[propToSortBy] ? 1 : -1;
        }

        if (selectedColumn.sortingFunction)
        {
          itemsToSort.sort(function(a, b)
          {
            var sortFNResult = selectedColumn.sortingFunction(a, b);
            if (sortFNResult === 0)
            {
              sortFNResult = defaultSortFN(a, b);
            }
            return sortFNResult;
          })
        }
        else
        {
          itemsToSort.sort(defaultSortFN);
        }

        if (this.state.sortBy.order === "desc")
        {
          itemsToSort.reverse();
        }
        //else if (this.state.sortBy.order !== "desc") throw new Error("Invalid sort parameter");

        this.props.sortedItems = itemsToSort;
      },

      shiftSelection: function(amountToShift: number)
      {
        var reverseIndexes = {};
        for (var i = 0; i < this.props.sortedItems.length; i++)
        {
          reverseIndexes[this.props.sortedItems[i].key] = i;
        };
        var currSelectedIndex = reverseIndexes[this.state.selected.key];
        var nextIndex = (currSelectedIndex + amountToShift) % this.props.sortedItems.length;
        if (nextIndex < 0)
        {
          nextIndex += this.props.sortedItems.length;
        }

        this.handleSelectRow(this.props.sortedItems[nextIndex]);
      },
      render: function()
      {
        var self = this;
        var columns = [];
        var headerLabels = [];

        this.state.columns.forEach(function(column)
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

          var sortStatus = null;

          if (!column.notSortable) sortStatus = "sortable";

          if (self.state.sortBy.column && self.state.sortBy.column.key === column.key)
          {
            sortStatus += " sorted-" + self.state.sortBy.order;
          }
          else if (!column.notSortable) sortStatus += " unsorted";

          headerLabels.push(
            React.DOM.th(
              {
                className: sortStatus,
                title: column.title || colProps.title || null,
                onMouseDown: self.handleSelectColumn.bind(null, column),
                onTouchStart: self.handleSelectColumn.bind(null, column),
                key: column.key
              }, column.label)
          );
        });

        this.sort();

        var sortedItems = this.props.sortedItems;
        
        var rows = [];

        sortedItems.forEach(function(item)
        {
          item.data.key = item.key;
          item.data.activeColumns = self.state.columns;
          item.data.handleClick = self.handleSelectRow.bind(null, item);
          item.data.isSelected =
            (self.state.selected && self.state.selected.key === item.key);
          var row = item.data.rowConstructor(item.data);

          rows.push(
            row
          );
        });

        return(
          React.DOM.table(
          {
            tabIndex: 1,
            className: "react-list"
          },
            React.DOM.colgroup(null,
              columns
            ),

            React.DOM.thead(null,
              React.DOM.tr(null,
                headerLabels
              )
            ),

            React.DOM.tbody(null,
              rows
            )
          )
        );
      }
      
    });
  }
}
