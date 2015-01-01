module Rance
{
  export module UIComponents
  {
    export var SaveListItem = React.createClass(
    {
      displayName: "SaveListItem",

      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "save-list-item-cell" + " save-list-" + type;

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
          className: "save-list-item",
          onClick : this.props.handleClick
        };

        return(
          React.DOM.tr(rowProps,
            cells
          )
        );
      }
    });
  }
}
