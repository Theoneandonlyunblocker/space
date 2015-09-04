module Rance
{
  export module UIComponents
  {
    export var ItemListItem = React.createClass(
    {
      displayName: "ItemListItem",
      mixins: [Draggable],

      onDragStart: function()
      {
        console.log("onDragStart", this.props.item.template.displayName);
        this.props.onDragStart(this.props.item);
      },
      onDragEnd: function()
      {
        this.props.onDragEnd();
      },

      makeCell: function(type: string)
      {
        var cellProps: any = {};
        cellProps.key = type;
        cellProps.className = "item-list-item-cell" + " item-list-" + type;

        var cellContent: any;

        switch (type)
        {
          case "ability":
          {
            if (this.props.abilityTemplate)
            {
              cellProps.title = this.props.abilityTemplate.description;
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

      makeDragClone: function()
      {
        var clone = new Image();
        clone.src = this.props.item.template.icon;
        clone.className = "item-icon-base draggable dragging";

        return clone;
      },

      render: function()
      {
        var item = this.props.item;
        var columns = this.props.activeColumns;

        if (this.state.dragging && this.state.clone)
        {
          this.state.clone.style.left = "" + this.state.dragPos.left + "px";
          this.state.clone.style.top = "" + this.state.dragPos.top + "px";
        }

        var cells: any = [];

        for (var i = 0; i < columns.length; i++)
        {
          var cell = this.makeCell(columns[i].key);

          cells.push(cell);
        }

        var rowProps: any =
        {
          className: "item-list-item",
          onClick : this.props.handleClick,
          key: this.props.key
        };
        
        if (this.props.isDraggable)
        {
          rowProps.className += " draggable";
          rowProps.onTouchStart = rowProps.onMouseDown =
            this.handleMouseDown;
        }

        if (this.props.isSelected)
        {
          rowProps.className += " selected-item";
        };

        if (this.props.isReserved)
        {
          rowProps.className += " reserved-item";
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
