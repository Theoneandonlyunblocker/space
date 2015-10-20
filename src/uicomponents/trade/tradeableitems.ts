/// <reference path="../../player.ts" />

/// <reference path="tradeableitemslist.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeableItems = React.createClass(
    {
      displayName: "TradeableItems",

      propTypes:
      {
        player: React.PropTypes.instanceOf(Player).isRequired,
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "tradeable-items"
          },
            React.DOM.div(
            {
              className: "tradeable-items-header"
            },
              "tradeable items " + this.props.player.name
            ),
            UIComponents.TradeableItemsList(
            {
              player: this.props.player
            })
          )
        );
      }
    })
  }
}
