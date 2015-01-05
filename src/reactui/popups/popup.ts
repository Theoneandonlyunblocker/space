/// <reference path="../mixins/draggable.ts" />

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
          zIndex: this.props.incrementZIndex()
        });
      },

      onDragStart: function()
      {
        this.setState(
        {
          zIndex: this.props.incrementZIndex()
        });
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
            zIndex: this.state.zIndex
          }
        };

        if (this.state.dragging)
        {
          divProps.className += " dragging";
        }

        var contentProps = this.props.contentProps;

        contentProps.closePopup = this.props.closePopup

        return(
          React.DOM.div(divProps,
            this.props.contentConstructor(contentProps)
          )
        );
      }
    });
  }
}