module Rance
{
  export module UIComponents
  {
    export var BuildableBuilding = React.createClass(
    {
      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "buildable-building-list-item-cell";

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
        var cells = [];
        var columns = this.props.activeColumns;

        for (var i = 0; i < columns.length; i++)
        {
          cells.push(
            this.makeCell(columns[i].key)
          );
        }

        return(
          React.DOM.tr(
          {
            className: "buildable-building"
          },
          cells
          )
        );
      }
    });
  }
}