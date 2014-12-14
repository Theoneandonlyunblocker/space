module Rance
{
  export module UIComponents
  {
    export var ItemListItem = React.createClass(
    {
      displayName: "ItemListItem",
      mixins: [Draggable],

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.item);
      },
      onDragEnd: function(e)
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
        var item = this.props.item;
        var columns = this.props.activeColumns;

        var cells: any = [];

        for (var i = 0; i < columns.length; i++)
        {
          var cell = this.makeCell(columns[i].key);

          cells.push(cell);
        }

        var rowProps: any =
        {
          className: "item-list-item",
          onClick : this.props.handleClick
        };

        if (this.props.isDraggable)
        {
          rowProps.className += " draggable";
          rowProps.onTouchStart = rowProps.onMouseDown =
            this.handleMouseDown;
        }

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
