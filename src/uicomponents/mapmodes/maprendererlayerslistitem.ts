module Rance
{
  export module UIComponents
  {
    export var MapRendererLayersListItem = React.createClass(
    {
      displayName: "MapRendererLayersListItem",
      mixins: [Draggable, DropTarget],
      cachedMidPoint: undefined,

      getInitialState: function()
      {
        return(
        {
          hoverSide: null
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.listItemIsDragging !== this.props.listItemIsDragging)
        {
          this.cachedMidPoint = undefined;
          this.clearHover();
        }
      },


      onDragStart: function()
      {
        this.props.onDragStart(this.props.layer);
      },

      onDragEnd: function()
      {
        this.props.onDragEnd();
      },

      handleHover: function(e: MouseEvent)
      {
        if (!this.cachedMidPoint)
        {
          var rect = this.getDOMNode().getBoundingClientRect();
          this.cachedMidPoint = rect.top + rect.height / 2;
        }

        var isAbove = e.clientY < this.cachedMidPoint;

        this.setState(
        {
          hoverSide: (isAbove ? "top" : "bottom")
        });

        this.props.setHoverPosition(this.props.layer, isAbove);
      },

      clearHover: function()
      {
        this.setState(
        {
          hoverSide: null
        });
      },

      render: function()
      {
        var divProps: any =
        {
          className: "map-renderer-layers-list-item draggable",
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleMouseDown
        };

        if (this.state.dragging)
        {
          divProps.style = this.state.dragPos;
          divProps.className += " dragging";
        }
        if (this.props.listItemIsDragging)
        {
          divProps.onMouseMove = this.handleHover;
          divProps.onMouseLeave = this.clearHover;
          if (this.state.hoverSide)
          {
            divProps.className += " insert-" + this.state.hoverSide;
          }
        }


        return(
          React.DOM.li(divProps,
            React.DOM.input(
            {
              type: "checkbox",
              className: "map-renderer-layers-list-item-checkbox",
              checked: this.props.isActive,
              onChange: this.props.toggleActive
            }),
            React.DOM.span(
            {
              className: "map-renderer-layers-list-item-name"
            },
              this.props.layerName
            )
          )
        );
      }
    })
  }
}
