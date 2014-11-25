/// <reference path="../mixins/draggable.ts" />

module Rance
{
  export module UIComponents
  {
    export var Popup = React.createClass(
    {
      mixins: [Draggable],

      onDragStart: function()
      {
        this.zIndex = this.props.incrementZIndex();
      },

      render: function()
      {
        var divProps: any =
        {
          className: "react-popup draggable",
          onTouchStart: this.handleMouseDown,
          onMouseDown: this.handleMouseDown,
          style:
          {
            top: this.state.dragPos ? this.state.dragPos.top : 0,
            left: this.state.dragPos ? this.state.dragPos.left : 0,
            zIndex: this.zIndex
          }
        };

        if (this.state.dragging)
        {
          divProps.className += " dragging";
        }

        return(
          React.DOM.div(divProps,
            this.props.content
          )
        );
      }
    });
  }
}