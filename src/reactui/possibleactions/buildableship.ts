module Rance
{
  export module UIComponents
  {
    export var BuildableShip = React.createClass(
    {
      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "buildable-ship-list-item-cell " + type;

        var cellContent: any;

        switch (type)
        {
          case ("buildCost"):
          {
            if (this.props.player.money < this.props.buildCost)
            {
              cellProps.className += " negative";
            }
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
        var player = this.props.player;
        var cells = [];
        var columns = this.props.activeColumns;

        for (var i = 0; i < columns.length; i++)
        {
          cells.push(
            this.makeCell(columns[i].key)
          );
        }

        var props: any =
        {
          className: "buildable-item buildable-ship",
          onClick: this.props.handleClick
        }
        if (player.money < this.props.buildCost)
        {
          props.onClick = null;
          props.disabled = true;
          props.className += " disabled";
        }

        return(
          React.DOM.tr(props,
          cells
          )
        );
      }
    });
  }
}