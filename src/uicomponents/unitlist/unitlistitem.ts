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

      componentDidMount: function()
      {
        if (!this.props.isDraggable) return;

        var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

        this.forcedDragOffset =
        {
          x: container.offsetWidth / 2,
          y: container.offsetHeight / 2
        }
      },

      componentDidUpdate: function()
      {
        if (this.needsFirstTouchUpdate && this.refs.dragClone)
        {
          var node = this.refs.dragClone.getDOMNode();
          node.classList.add("draggable");
          node.classList.add("dragging");

          var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

          node.style.width = "" + container.offsetWidth + "px";
          node.style.height = "" + container.offsetHeight + "px";

          this.needsFirstTouchUpdate = false;
        }
      },

      onDragStart: function()
      {
        this.props.onDragStart(this.props.unit);
      },

      onDragMove: function(x: number, y: number)
      {
        if (!this.refs.dragClone) return;

        var node = this.refs.dragClone.getDOMNode();
        node.classList.add("draggable");
        node.classList.add("dragging");
        node.style.left = "" + x + "px";
        node.style.top = "" + y + "px";

        var container = <HTMLElement> document.getElementsByClassName("unit-wrapper")[0];

        node.style.width = "" + container.offsetWidth + "px";
        node.style.height = "" + container.offsetHeight + "px";


        this.forcedDragOffset =
        {
          x: container.offsetWidth / 2,
          y: container.offsetHeight / 2
        }
      },

      onDragEnd: function()
      {
        this.props.onDragEnd();
      },


      handleMouseEnter: function()
      {
        this.props.onMouseEnter(this.props.unit);
      },
      handleMouseLeave: function()
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

      render: function(): any
      {
        var unit = this.props.unit;
        var columns = this.props.activeColumns;

        if (this.state.dragging)
        {
          return(
            UIComponents.Unit(
            {
              ref: "dragClone",
              unit: unit
            })
          );
        }


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
        if (this.props.isHovered)
        {
          rowProps.className += " unit-list-item-hovered";
        }

        if (this.props.noActionsLeft)
        {
          rowProps.className += " no-actions-left";
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
