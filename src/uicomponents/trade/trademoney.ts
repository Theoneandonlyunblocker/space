module Rance
{
  export module UIComponents
  {
    export var TradeMoney = React.createClass(
    {
      displayName: "TradeMoney",

      propTypes:
      {
        moneyAvailable: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired
      },

      render: function()
      {
        return(
          React.DOM.tr(
          {
            className: "tradeable-items-list-item"
          },
            React.DOM.td(null,
              React.DOM.span(
              {
                className: "trade-money-title"
              },
                this.props.title
              ),
              React.DOM.span(
              {
                className: "trade-money-money-available"
              },
                this.props.moneyAvailable
              )
            )
          )
        );
      }
    })
  }
}
