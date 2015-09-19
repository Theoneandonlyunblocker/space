/// <reference path="../mixins/draggable.ts" />
/// <reference path="resizehandle.ts" />

module Rance
{
  export module UIComponents
  {
    export var Popup = React.createClass(
    {
      displayName: "Popup",
      mixins: [Draggable],

      getInitialState: function()
      {
        return(
        {
          zIndex: -1
        });
      },

      componentDidMount: function()
      {
        this.setInitialPosition();
      },

      onMouseDown: function(e: MouseEvent)
      {
        this.handleMouseDown(e);
        this.setState(
        {
          zIndex: this.props.incrementZIndex()
        });
      },

      setInitialPosition: function()
      {
        var rect = this.getDOMNode().getBoundingClientRect();
        var container = this.containerElement; // set in draggable mixin
        var position = this.props.getInitialPosition(rect, container);

        var left = position.left;
        var top = position.top;

        left = clamp(left, 0, container.offsetWidth - rect.width);
        top = clamp(top, 0, container.offsetHeight - rect.height);


        this.setState(
        {
          zIndex: this.props.incrementZIndex(),
          dragPos:
          {
            top: top,
            left: left
          },
          width: undefined,
          height: undefined
        });
      },

      handleResizeMove: function(x: number, y: number)
      {
        var minWidth = this.props.minWidth || 0;
        var maxWidth = this.props.maxWidth || window.innerWidth;
        var minHeight = this.props.minHeight || 0;
        var maxHeight = this.props.maxHeight || window.innerHeight;
        this.setState(
        {
          width: clamp(x - this.state.dragPos.left, minWidth, maxWidth),
          height: clamp(y - this.state.dragPos.top, minHeight, maxHeight)
        });
      },

      render: function()
      {
        var divProps: any =
        {
          className: "popup draggable-container",
          onTouchStart: this.onMouseDown,
          onMouseDown: this.onMouseDown,
          style:
          {
            top: this.state.dragPos ? this.state.dragPos.top : 0,
            left: this.state.dragPos ? this.state.dragPos.left : 0,
            width: this.state.width,
            height: this.state.height,
            zIndex: this.state.zIndex
          }
        };

        if (this.state.dragging)
        {
          divProps.className += " dragging";
        }

        var contentProps = this.props.contentProps;

        contentProps.closePopup = this.props.closePopup

        var resizeHandle = !this.props.resizable ? null : UIComponents.PopupResizeHandle(
        {
          handleResize: this.handleResizeMove
        });

        return(
          React.DOM.div(divProps,
            this.props.contentConstructor(contentProps),
            resizeHandle
          )
        );
      }
    });
  }
}