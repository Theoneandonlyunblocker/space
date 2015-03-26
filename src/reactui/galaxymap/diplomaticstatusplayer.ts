module Rance
{
  export module UIComponents
  {
    export var DiplomaticStatusPlayer = React.createClass(
    {
      displayName: "DiplomaticStatusPlayer",

      makeCell: function(type: string)
      {
        var className = "diplomatic-status-player-cell" + " diplomatic-status-" + type;

        return(
          React.DOM.td(
          {
            key: type,
            className: className
          }, this.props[type])
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
          className: "diplomatic-status-player",
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
    })
  }
}
