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
          currentStagingItemDragKey: undefined,
          currentDragItemPlayer: undefined
        });
      },
      

      handleCancel: function()
      {
        this.props.handleClose();
      },

      handleOk: function()
      {
        this.selfPlayerTrade.executeAllStagedTrades(this.props.otherPlayer);
        this.otherPlayerTrade.executeAllStagedTrades(this.props.selfPlayer);
        this.selfPlayerTrade.updateAfterExecutedTrade();
        this.otherPlayerTrade.updateAfterExecutedTrade();
        this.forceUpdate();
      },

      getActiveTrade: function(player?: string)
      {
        var playerStringToUse = player || this.state.currentDragItemPlayer;
        if (playerStringToUse === "self")
        {
          return this.selfPlayerTrade;
        }
        else if (playerStringToUse === "other")
        {
          return this.otherPlayerTrade;
        }
        else return null;
      },

      handleStageItem: function(player: string, key: string)
      {
        var activeTrade = this.getActiveTrade(player);

        var availableItems = activeTrade.getItemsAvailableForTrade();
        var availableAmount = availableItems[key].amount;

        if (availableAmount === 1)
        {
          activeTrade.stageItem(key, 1);
        }
        else
        {
          // TODO trade TODO ai | don't allow player to stage ai items
          activeTrade.stageItem(key, availableAmount);
        }

        if (!this.state.currentDragItemPlayer)
        {
          this.forceUpdate();
        }
      },

      handleAdjustStagedItemAmount: function(player: string, key: string, newAmount: number)
      {
        var activeTrade = this.getActiveTrade(player);
        {
          activeTrade.setStagedItemAmount(key, newAmount);
        }

        this.forceUpdate();
      },

      handleRemoveStagedItem: function(player: string, key: string)
      {
        var activeTrade = this.getActiveTrade(player);
        activeTrade.removeStagedItem(key);

        if (!this.state.currentDragItemPlayer)
        {
          this.forceUpdate();
        }
      },

      handleAvailableDragStart: function(player: string, key: string)
      {
        this.setState(
        {
          currentAvailableItemDragKey: key,
          currentDragItemPlayer: player
        });
      },

      handleStagingDragStart: function(player: string, key: string)
      {
        this.setState(
        {
          currentStagingItemDragKey: key,
          currentDragItemPlayer: player
        });
      },

      handleDragEnd: function()
      {
        this.setState(
        {
          currentAvailableItemDragKey: undefined,
          currentStagingItemDragKey: undefined,
          currentDragItemPlayer: undefined
        });
      },

      handleAvailableMouseUp: function()
      {
        if (this.state.currentStagingItemDragKey)
        {
          this.handleRemoveStagedItem(null, this.state.currentStagingItemDragKey);
        }
      },

      handleStagingAreaMouseUp: function()
      {
        if (this.state.currentAvailableItemDragKey)
        {
          this.handleStageItem(null, this.state.currentAvailableItemDragKey);
        }
      },

      render: function()
      {
        var hasDragItem = Boolean(this.state.currentDragItemPlayer);
        var selfPlayerAcceptsDrop = this.state.currentDragItemPlayer === "self";
        var otherPlayerAcceptsDrop = this.state.currentDragItemPlayer === "other";
        var selfAvailableItems = this.selfPlayerTrade.getItemsAvailableForTrade();
        var otherAvailableItems = this.otherPlayerTrade.getItemsAvailableForTrade();

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
                tradeableItems: selfAvailableItems,
                noListHeader: true,
                isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
                onDragStart: this.handleAvailableDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleAvailableMouseUp,
                onItemClick: this.handleStageItem.bind(this, "self")
              }),
              UIComponents.TradeableItems(
              {
                header: "tradeable items " + this.props.otherPlayer.name,
                tradeableItems: otherAvailableItems,
                noListHeader: true,
                isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
                onDragStart: this.handleAvailableDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleAvailableMouseUp,
                onItemClick: this.handleStageItem.bind(this, "other")
              })
            ),
            React.DOM.div(
            {
              className: "tradeable-items-container trade-staging-areas-container"
            },
              UIComponents.TradeableItems(
              {
                tradeableItems: this.selfPlayerTrade.stagedItems,
                availableItems: this.selfPlayerTrade.allItems,
                noListHeader: true,
                isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
                onDragStart: this.handleStagingDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleStagingAreaMouseUp,
                onItemClick: this.handleRemoveStagedItem.bind(this, "self"),
                adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "self")
              }),
              UIComponents.TradeableItems(
              {
                tradeableItems: this.otherPlayerTrade.stagedItems,
                availableItems: this.otherPlayerTrade.allItems,
                noListHeader: true,
                isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
                onDragStart: this.handleStagingDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleStagingAreaMouseUp,
                onItemClick: this.handleRemoveStagedItem.bind(this, "other"),
                adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "other")
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
