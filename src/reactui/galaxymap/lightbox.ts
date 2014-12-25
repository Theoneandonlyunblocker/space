module Rance
{
  export module UIComponents
  {
    export var LightBox = React.createClass(
    {
      displayName: "LightBox",

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "light-box-wrapper"
          },
            React.DOM.div(
            {
              className: "light-box-container"
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
                this.props.content
              )
            )
          )
        );
      }
    })
  }
}
