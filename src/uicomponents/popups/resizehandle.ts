/// <reference path="../mixins/draggable.ts" />

module Rance
{
  export module UIComponents
  {
    export var PopupResizeHandle = React.createClass(
    {
      displayName: "PopupResizeHandle",
      mixins: [Draggable],

      // originBottom: undefined,
      // originRight: undefined,

      // onDragStart: function()
      // {
      //   var rect = this.getDOMNode().getBoundingClientRect();
      //   this.originBottom = rect.bottom;
      //   this.originRight = rect.right;
      // },

      onDragMove: function(x: number, y: number)
      {
        var rect = this.getDOMNode().getBoundingClientRect();
        this.props.handleResize(x + rect.width, y + rect.height);
      },

      render: function()
      {
        return(
          React.DOM.img(
          {
            className: "popup-resize-handle",
            src: "img\/icons\/resizeHandle.png",
            onTouchStart: this.handleMouseDown,
            onMouseDown: this.handleMouseDown
          })
        );
      }
    })
  }
}
