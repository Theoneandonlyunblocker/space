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

      },

      getActiveTrade: function()
      {
        if (this.state.currentDragItemPlayer === "self")
        {
          return this.selfPlayerTrade;
        }
        else if (this.state.currentDragItemPlayer === "other")
        {
          return this.otherPlayerTrade;
        }
        else return null;
      },

      handleStageItem: function(key: string)
      {
        var activeTrade = this.getActiveTrade();

        var availableItems = activeTrade.getItemsAvailableForTrade();
        var availableAmount = availableItems[key].amount;

        if (availableAmount === 1)
        {
          activeTrade.stageItem(key, 1);
        }
        else
        {
          // TODO
          activeTrade.stageItem(key, availableAmount);
        }

        this.forceUpdate();
      },

      handleRemoveStagedItem: function(key: string)
      {
        var activeTrade = this.getActiveTrade();
        activeTrade.removeStagedItem(key);

        this.forceUpdate();
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
        console.log("drag end");
        if (this.state.currentStagingItemDragKey)
        {
          console.log("staging item up outside either")
          // TODO trade remove staged item
        }
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
          console.log("available area up")
          this.handleRemoveStagedItem(this.state.currentStagingItemDragKey);
        }
      },

      handleStagingAreaMouseUp: function()
      {
        if (this.state.currentAvailableItemDragKey)
        {
          console.log("staging area up")
          this.handleStageItem(this.state.currentAvailableItemDragKey);
        }
      },

      render: function()
      {
        var hasDragItem = Boolean(this.state.currentDragItemPlayer);
        var selfPlayerAcceptsDrop = this.state.currentDragItemPlayer === "self";
        var otherPlayerAcceptsDrop = this.state.currentDragItemPlayer === "other";

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
                availableItems: this.selfPlayerTrade.getItemsAvailableForTrade(),
                hasDragItem: hasDragItem,
                onDragStart: this.handleAvailableDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: selfPlayerAcceptsDrop ? this.handleAvailableMouseUp : null
              }),
              UIComponents.TradeableItems(
              {
                header: "tradeable items " + this.props.otherPlayer.name,
                availableItems: this.otherPlayerTrade.getItemsAvailableForTrade(),
                hasDragItem: hasDragItem,
                onDragStart: this.handleAvailableDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: otherPlayerAcceptsDrop ? this.handleAvailableMouseUp : null
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
                hasDragItem: hasDragItem,
                onDragStart: this.handleStagingDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: selfPlayerAcceptsDrop ? this.handleStagingAreaMouseUp : null
              }),
              UIComponents.TradeableItems(
              {
                availableItems: this.otherPlayerTrade.stagedItems,
                noListHeader: true,
                hasDragItem: hasDragItem,
                onDragStart: this.handleStagingDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: otherPlayerAcceptsDrop ? this.handleStagingAreaMouseUp : null
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
