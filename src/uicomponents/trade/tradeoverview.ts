/// <reference path="../../player.ts" />

/// <reference path="tradeableitems.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeOverview = React.createClass(
    {
      displayName: "TradeOverview",

      propTypes:
      {
        selfPlayer: React.PropTypes.instanceOf(Player).isRequired,
        otherPlayer: React.PropTypes.instanceOf(Player).isRequired
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "trade-overview"
          },
            React.DOM.div(
            {
              className: "tradeable-items-container"
            },
              UIComponents.TradeableItems(
              {
                player: this.props.selfPlayer
              }),
              UIComponents.TradeableItems(
              {
                player: this.props.otherPlayer
              })
            )
          )
        );
      }
    })
  }
}
