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
        availableItems: React.PropTypes.object.isRequired, // ITradeableItems
        header: React.PropTypes.string,
        noListHeader: React.PropTypes.bool,
        onMouseUp: React.PropTypes.func,
        onDragStart: React.PropTypes.func
      },

      handleMouseUp: function()
      {

      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "tradeable-items",
          },
            !this.props.header ? null : React.DOM.div(
            {
              className: "tradeable-items-header"
            },
              this.props.header
            ),
            UIComponents.TradeableItemsList(
            {
              availableItems: this.props.availableItems,
              noListHeader: this.props.noListHeader,
              onDragStart: this.props.onDragStart
            })
          )
        );
      }
    })
  }
}
