module Rance
{
  export module UIComponents
  {
    export var AttitudeModifierInfo = React.createClass(
    {
      displayName: "AttitudeModifierInfo",

      makeCell: function(type: string)
      {
        var className = "attitude-modifier-info-cell" + " attitude-modifier-info-" + type;

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

        return(
          React.DOM.tr(rowProps,
            cells
          )
        );
      }
    })
  }
}
