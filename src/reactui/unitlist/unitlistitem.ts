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


      handleMouseEnter: function(e)
      {
        this.props.onMouseEnter(this.props.unit);
      },
      handleMouseLeave: function(e)
      {
        this.props.onMouseLeave();
      },


      makeCell: function(type: string)
      {
        var unit = this.props.unit;
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
              maxHealth: this.props.maxHealth,
              currentHealth: this.props.currentHealth,
              isSquadron: true
            });

            break;
          }
          case "attack":
          case "defence":
          case "intelligence":
          case "speed":
          {
            cellContent = this.props[type];
            
            if (unit.attributes[type] < unit.baseAttributes[type])
            {
              cellProps.className += " lowered-stat"
            }
            else if (unit.attributes[type] > unit.baseAttributes[type])
            {
              cellProps.className += " raised-stat"
            }

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
          className: "unit-list-item",
          onClick : this.props.handleClick
        };

        if (this.props.isDraggable && !this.props.noActionsLeft)
        {
          rowProps.className += " draggable";
          rowProps.onTouchStart = rowProps.onMouseDown =
            this.handleMouseDown;
        }


        if (this.props.isSelected)
        {
          rowProps.className += " selected-unit";
        };

        if (this.props.isReserved)
        {
          rowProps.className += " reserved-unit";
        }

        if (this.props.noActionsLeft)
        {
          rowProps.className += " no-actions-left";
        }


        if (this.state.dragging)
        {
          rowProps.style = this.state.dragPos;
          rowProps.className += " dragging";
        }
        else if (this.props.onMouseEnter)
        {
          rowProps.onMouseEnter = this.handleMouseEnter;
          rowProps.onMouseLeave = this.handleMouseLeave;
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
