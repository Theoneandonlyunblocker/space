/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../player.ts" />
/// <reference path="../../trade.ts" />

/// <reference path="tradeableitems.ts" />


import Player from "../../../src/Player.ts";
import TradeableItems from "./TradeableItems.ts";
import Trade from "../../../src/Trade.ts";


interface PropTypes extends React.Props<any>
{
  selfPlayer: Player;
  otherPlayer: Player;
  handleClose: reactTypeTODO_func;
}

interface StateType
{
  currentStagingItemDragKey?: any; // TODO refactor | define state type 456
  currentAvailableItemDragKey?: any; // TODO refactor | define state type 456
  currentDragItemPlayer?: any; // TODO refactor | define state type 456
}

export class TradeOverviewComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TradeOverview";
  selfPlayerTrade: reactTypeTODO_any = undefined;
  otherPlayerTrade: reactTypeTODO_any = undefined;


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleStagingDragStart = this.handleStagingDragStart.bind(this);
    this.handleAvailableDragStart = this.handleAvailableDragStart.bind(this);
    this.handleRemoveStagedItem = this.handleRemoveStagedItem.bind(this);
    this.getActiveTrade = this.getActiveTrade.bind(this);
    this.handleStageItem = this.handleStageItem.bind(this);
    this.handleAdjustStagedItemAmount = this.handleAdjustStagedItemAmount.bind(this);
    this.handleStagingAreaMouseUp = this.handleStagingAreaMouseUp.bind(this);
    this.handleAvailableMouseUp = this.handleAvailableMouseUp.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);    
  }
  
  componentWillMount()
  {
    this.selfPlayerTrade = new Trade(this.props.selfPlayer);
    this.otherPlayerTrade = new Trade(this.props.otherPlayer);
  }

  private getInitialState(): StateType
  {
    return(
    {
      currentAvailableItemDragKey: undefined,
      currentStagingItemDragKey: undefined,
      currentDragItemPlayer: undefined
    });
  }
  

  handleCancel()
  {
    this.props.handleClose();
  }

  handleOk()
  {
    this.selfPlayerTrade.executeAllStagedTrades(this.props.otherPlayer);
    this.otherPlayerTrade.executeAllStagedTrades(this.props.selfPlayer);
    this.selfPlayerTrade.updateAfterExecutedTrade();
    this.otherPlayerTrade.updateAfterExecutedTrade();
    this.forceUpdate();
  }

  getActiveTrade(player?: string)
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
  }

  handleStageItem(player: string, key: string)
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
  }

  handleAdjustStagedItemAmount(player: string, key: string, newAmount: number)
  {
    var activeTrade = this.getActiveTrade(player);
    {
      activeTrade.setStagedItemAmount(key, newAmount);
    }

    this.forceUpdate();
  }

  handleRemoveStagedItem(player: string, key: string)
  {
    var activeTrade = this.getActiveTrade(player);
    activeTrade.removeStagedItem(key);

    if (!this.state.currentDragItemPlayer)
    {
      this.forceUpdate();
    }
  }

  handleAvailableDragStart(player: string, key: string)
  {
    this.setState(
    {
      currentAvailableItemDragKey: key,
      currentDragItemPlayer: player
    });
  }

  handleStagingDragStart(player: string, key: string)
  {
    this.setState(
    {
      currentStagingItemDragKey: key,
      currentDragItemPlayer: player
    });
  }

  handleDragEnd()
  {
    this.setState(
    {
      currentAvailableItemDragKey: undefined,
      currentStagingItemDragKey: undefined,
      currentDragItemPlayer: undefined
    });
  }

  handleAvailableMouseUp()
  {
    if (this.state.currentStagingItemDragKey)
    {
      this.handleRemoveStagedItem(null, this.state.currentStagingItemDragKey);
    }
  }

  handleStagingAreaMouseUp()
  {
    if (this.state.currentAvailableItemDragKey)
    {
      this.handleStageItem(null, this.state.currentAvailableItemDragKey);
    }
  }

  render()
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
          TradeableItems(
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
          TradeableItems(
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
          TradeableItems(
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
          TradeableItems(
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(TradeOverviewComponent);
export default Factory;
