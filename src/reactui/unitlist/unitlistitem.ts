/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts" />

module Rance
{
  export module UIComponents
  {
    export var UnitListItem = React.createClass(
    {
      displayName: "UnitListItem",
      mixins: [Draggable],

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.unit);
      },
      onDragEnd: function(e)
      {
        this.props.onDragEnd();
      },

      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "unit-list-item-cell" + " unit-list-" + type;

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

        var rowProps: any =
        {
          className: "unit-list-item draggable",
          onClick : this.props.handleClick,
          onTouchStart : this.handleMouseDown,
          onMouseDown: this.handleMouseDown
        };

        if (this.props.isSelected)
        {
          rowProps.className += " selected";
        };

        if (this.props.isReserved)
        {
          rowProps.className += " reserved";
        }


        if (this.state.dragging)
        {
          rowProps.style = this.state.dragPos;
          rowProps.className += " dragging";
        }

        return(
          React.DOM.tr(rowProps,
            cells
          )
        );
      }
    });
  }
}
