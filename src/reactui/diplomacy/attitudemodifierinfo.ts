module Rance
{
  export module UIComponents
  {
    export var AttitudeModifierInfo = React.createClass(
    {
      displayName: "AttitudeModifierInfo",

      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "attitude-modifier-info-cell" +
          " attitude-modifier-info-" + type;

        var cellContent: any;

        switch (type)
        {
          case "endTurn":
          {
            if (this.props.endTurn < 0)
            {
              cellContent = null;
              return;
            }
          }
          case "strength":
          {
            var relativeValue = getRelativeValue(this.props.strength, -10, 10);
            relativeValue = clamp(relativeValue, 0, 1);

            var deviation = Math.abs(0.5 - relativeValue) * 2;

            var hue = 110 * relativeValue;
            var saturation = 10 + 80 * deviation;
            var lightness = 70 - 20 * deviation;

            cellProps.style =
            {
              color: "hsl(" +
                hue + "," +
                saturation + "%," +
                lightness + "%)"
            }
          }
          default:
          {
            cellContent = this.props[type];

            if (isFinite(cellContent))
            {
              cellProps.className += " center-text"
            }

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
