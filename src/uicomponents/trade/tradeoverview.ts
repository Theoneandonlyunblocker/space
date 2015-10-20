/// <reference path="../../player.ts" />
/// <reference path="../../trade.ts" />

/// <reference path="tradeableitems.ts" />

module Rance
{
  export module UIComponents
  {
    export var TradeOverview = React.createClass(
    {
      displayName: "TradeOverview",
      selfPlayerTrade: undefined,
      otherPlayerTrade: undefined,

      propTypes:
      {
        selfPlayer: React.PropTypes.instanceOf(Player).isRequired,
        otherPlayer: React.PropTypes.instanceOf(Player).isRequired,
        handleClose: React.PropTypes.func.isRequired
      },

      componentWillMount: function()
      {
        this.selfPlayerTrade = new Trade(this.props.selfPlayer);
        this.otherPlayerTrade = new Trade(this.props.otherPlayer);
      },

      getInitialState: function()
      {
        return(
        {
          currentAvailableItemDragKey: undefined,
          currentStagingItemDragKey: undefined
        });
      },
      

      handleCancel: function()
      {
        this.props.handleClose();
      },

      handleOk: function()
      {

      },

      handleAvailableDragStart: function(key: string)
      {
        this.setState(
        {
          currentAvailableItemDragKey: key
        });
      },

      handleDragEnd: function()
      {
        this.setState(
        {
          currentAvailableItemDragKey: undefined,
          currentStagingItemDragKey: undefined
        });
      },

      handleStagingAreaMouseUp: function()
      {
        if (this.currentAvailableItemDragKey)
        {
          console.log(this.state.currentAvailableItemDragKey);
        }
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
              className: "tradeable-items-container available-items-container"
            },
              UIComponents.TradeableItems(
              {
                header: "tradeable items " + this.props.selfPlayer.name,
                availableItems: this.selfPlayerTrade.getItemsAvailableForTrade()
              }),
              UIComponents.TradeableItems(
              {
                header: "tradeable items " + this.props.otherPlayer.name,
                availableItems: this.otherPlayerTrade.getItemsAvailableForTrade()
              })
            ),
            React.DOM.div(
            {
              className: "tradeable-items-container trade-staging-areas-container"
            },
              UIComponents.TradeableItems(
              {
                availableItems: this.selfPlayerTrade.stagedItems,
                noListHeader: true,
                hasDragItem: Boolean(this.state.currentAvailableItemDragKey)
              }),
              UIComponents.TradeableItems(
              {
                availableItems: this.otherPlayerTrade.stagedItems,
                noListHeader: true,
                hasDragItem: Boolean(this.state.currentAvailableItemDragKey)
              })
            ),
            React.DOM.div(
            {
              className: "trade-buttons-container"
            },
              React.DOM.button(
              {
                className: "trade-button",
                onClick: this.handleCancel
              },
                "Cancel"
              ),
              React.DOM.button(
              {
                className: "trade-button trade-button-ok",
                onClick: this.handleOk
              },
                "Ok"
              )
            )
          )
        );
      }
    })
  }
}
