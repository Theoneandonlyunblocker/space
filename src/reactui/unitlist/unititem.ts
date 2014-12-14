module Rance
{
  export module UIComponents
  {
    export var UnitItem = React.createClass(
    {
      displayName: "UnitItem",
      mixins: [Draggable],

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.item);
      },
      onDragEnd: function(e)
      {
        this.props.onDragEnd();
      },

      render: function()
      {
        if (!this.props.item) return(
          React.DOM.div({className: "empty-unit-item"})
        );
        var divProps: any =
        {
          className: "unit-item"
        };
        
        if (this.props.isDraggable)
        {
          divProps.className += " draggable";
          divProps.onMouseDown = divProps.onTouchStart =
            this.handleMouseDown;
        }

        if (this.state.dragging)
        {
          divProps.style = this.state.dragPos;
          divProps.className += " dragging";
        }

        return(
          React.DOM.div(divProps,
            this.props.item.template.displayName
          )
        );
      }
    });
  }
}