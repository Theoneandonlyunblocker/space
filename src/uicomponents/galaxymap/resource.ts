module Rance
{
  export module UIComponents
  {
    export var Resource = React.createClass(
    {
      displayName: "Resource",
      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "resource",
            title: this.props.resource.displayName
          },
            React.DOM.img(
            {
              className: "resource-icon",
              src: this.props.resource.icon
            },
              null
            ),
            React.DOM.div(
            {
              className: "resource-amount"
            },
              this.props.amount
            )
          )
        );
      }
    })
  }
}
