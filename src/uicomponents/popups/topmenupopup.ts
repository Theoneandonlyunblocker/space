module Rance
{
  export module UIComponents
  {
    export var TopMenuPopup = React.createClass(
    {
      displayName: "TopMenuPopup",

      render: function()
      {
        var contentProps = this.props.contentProps;
        contentProps.ref = "content";

        return(
          React.DOM.div(
          {
            className: "top-menu-popup-container draggable-container"
          },
            React.DOM.button(
            {
              className: "light-box-close",
              onClick: this.props.handleClose
            }, "X"),
            React.DOM.div(
            {
              className: "light-box-content"
            },
              this.props.contentConstructor(contentProps)
            )
          )
        );
      }
    })
  }
}
