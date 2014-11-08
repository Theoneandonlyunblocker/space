module Rance
{
  export module UIComponents
  {
    export var UnitListItem = React.createClass(
    {
      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "unit-list-item-cell";

        var cellContent: any;

        switch (type)
        {
          case "strength":
          {
            cellContent = UIComponents.UnitStrength(
            {
              maxStrength: this.props.maxStrength,
              currentStrength: this.props.currentStrength,
              isSquadron: true
            });

            break;
          }
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
        var unit = this.props.unit;
        var columns = this.props.activeColumns;

        var cells: any = [];

        for (var i = 0; i < columns.length; i++)
        {
          var cell = this.makeCell(columns[i].key);

          cells.push(cell);
        }

        return(
          React.DOM.tr({className: "unit-list-item"},
            cells
          )
        );
      }
    });
  }
}
