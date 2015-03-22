module Rance
{
  export module UIComponents
  {
    export var LightBox = React.createClass(
    {
      displayName: "LightBox",

      // far from ideal as it always triggers reflow twice
      // cant figure out how to do resizing better since content size is dynamic
      handleResize: function()
      {
        var container = this.refs.container.getDOMNode();
        container.classList.remove("light-box-horizontal-padding");
        container.classList.remove("light-box-fill-horizontal");

        if (container.getBoundingClientRect().width + 10 < window.innerWidth)
        {
          container.classList.add("light-box-horizontal-padding");
        }
        else
        {
          container.classList.add("light-box-fill-horizontal");
        }
      },

      componentDidMount: function()
      {
        window.addEventListener("resize", this.handleResize, false);
        this.handleResize();
      },
      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
      },
      componentDidUpdate: function()
      {
        this.handleResize();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "light-box-wrapper"
          },
            React.DOM.div(
            {
              className: "light-box-container",
              ref: "container"
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
