export namespace UIComponents
{
  export var EconomySummaryItem = React.createFactory(React.createClass(
  {
    displayName: "EconomySummaryItem",

    makeCell: function(type: string)
    {
      var cellProps: any = {};
      cellProps.key = type;
      cellProps.className = "economy-summary-item-cell" + " economy-summary-" + type;

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
    },

    render: function()
    {
      var columns = this.props.activeColumns;

      var cells: any = [];

      for (var i = 0; i < columns.length; i++)
      {
        var cell = this.makeCell(columns[i].key);

        cells.push(cell);
      }

      var rowProps: any =
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
  }));
}
