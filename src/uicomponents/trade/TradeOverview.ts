import * as React from "react";

import TradeableItemsComponentFactory from "./TradeableItems";

import Player from "../../Player";
import {Trade} from "../../Trade";
import {TradeOffer} from "../../TradeOffer";

import {localize} from "../../../localization/localize";


/* tslint:disable:member-access member-ordering */

export interface PropTypes extends React.Props<any>
{
  selfPlayer: Player;
  otherPlayer: Player;
  initialReceivedOffer?: TradeOffer;
  handleClose: () => void;
}

interface StateType
{
  currentDragItemKey?: string;
  currentDragItemPlayer?: "self" | "other";
  currentDragItemWasStaged?: boolean;
  activeTrade?: TradeOffer;
}

export class TradeOverviewComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "TradeOverview";
  public state: StateType;

  private selfTrade: TradeOffer;
  private otherTrade: TradeOffer;

  constructor(props: PropTypes)
  {
    super(props);

    this.selfTrade = TradeOverviewComponent.makeInitialTradeOffer(props.selfPlayer, props.otherPlayer);
    this.otherTrade = props.initialReceivedOffer ||
      props.otherPlayer.AIController.respondToTradeOffer(this.selfTrade);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private static makeInitialTradeOffer(selfPlayer: Player, otherPlayer: Player): TradeOffer
  {
    const ownTrade = new Trade(selfPlayer);

    // TODO 2017.04.25 | smarter way to do this for human player
    const willingnessToTradeItems: {[key: string]: number} = {};
    for (let key in ownTrade.allItems)
    {
      willingnessToTradeItems[key] = 1;
    }

    return(
    {
      ownTrade: ownTrade,
      otherTrade: new Trade(otherPlayer),
      willingnessToTradeItems: willingnessToTradeItems,
      message: "" ,
      willingToAccept: false,
    });
  }

  private bindMethods()
  {
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleStagingDragStart = this.handleStagingDragStart.bind(this);
    this.handleAvailableDragStart = this.handleAvailableDragStart.bind(this);
    this.handleRemoveStagedItem = this.handleRemoveStagedItem.bind(this);
    this.handleStageItem = this.handleStageItem.bind(this);
    this.handleAdjustStagedItemAmount = this.handleAdjustStagedItemAmount.bind(this);
    this.handleStagingAreaMouseUp = this.handleStagingAreaMouseUp.bind(this);
    this.handleAvailableMouseUp = this.handleAvailableMouseUp.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getActiveTradeObjectForPlayer = this.getActiveTradeObjectForPlayer.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      currentDragItemKey: undefined,
      currentDragItemPlayer: undefined,
      currentDragItemWasStaged: undefined,
      activeTrade: this.props.initialReceivedOffer ? this.otherTrade : this.selfTrade,
    });
  }


  handleCancel()
  {
    this.props.handleClose();
  }

  handleOk()
  {
    const activeTrade = this.state.activeTrade;
    if (activeTrade)
    {
      activeTrade.ownTrade.executeTrade(activeTrade.otherTrade);

      this.forceUpdate();
    }
  }

  private getActiveTradeObjectForPlayer(player: "self" | "other"): Trade
  {
    if (player === "self")
    {
      return this.state.activeTrade.ownTrade;
    }
    else if (player === "other")
    {
      return this.state.activeTrade.otherTrade;
    }
    else
    {
      throw new Error(`Invalid player key '${player}'`);
    }
  }
  handleStageItem(player: "self" | "other", key: string)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);

    const availableItems = activeTrade.getItemsAvailableForTrade();
    const availableAmount = availableItems[key].amount;

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

  handleAdjustStagedItemAmount(player: "self" | "other", key: string, newAmount: number)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    {
      activeTrade.setStagedItemAmount(key, newAmount);
    }

    this.forceUpdate();
  }

  handleRemoveStagedItem(player: "self" | "other", key: string)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    activeTrade.removeStagedItem(key);

    if (!this.state.currentDragItemPlayer)
    {
      this.forceUpdate();
    }
  }

  handleAvailableDragStart(player: "self" | "other", key: string)
  {
    this.setState(
    {
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: false,
    });
  }

  handleStagingDragStart(player: "self" | "other", key: string)
  {
    this.setState(
    {
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: true,
    });
  }

  handleDragEnd()
  {
    this.setState(
    {
      currentDragItemKey: undefined,
      currentDragItemPlayer: undefined,
      currentDragItemWasStaged: undefined,
    });
  }

  handleAvailableMouseUp()
  {
    if (this.state.currentDragItemKey && this.state.currentDragItemWasStaged)
    {
      this.handleRemoveStagedItem(null, this.state.currentDragItemKey);
    }
  }

  handleStagingAreaMouseUp()
  {
    if (this.state.currentDragItemKey && !this.state.currentDragItemWasStaged)
    {
      this.handleStageItem(null, this.state.currentDragItemKey);
    }
  }

  render()
  {
    const hasDragItem = Boolean(this.state.currentDragItemKey);
    const selfPlayerAcceptsDrop = this.state.currentDragItemPlayer === "self";
    const otherPlayerAcceptsDrop = this.state.currentDragItemPlayer === "other";
    const selfAvailableItems = this.state.activeTrade.ownTrade.getItemsAvailableForTrade();
    const otherAvailableItems = this.state.activeTrade.otherTrade.getItemsAvailableForTrade();

    const lastOfferWasByOtherPlayer = this.state.activeTrade === this.otherTrade;
    const ableToAcceptTrade = lastOfferWasByOtherPlayer && this.state.activeTrade.willingToAccept;

    return(
      React.DOM.div(
      {
        className: "trade-overview",
      },
        React.DOM.div(
        {
          className: "tradeable-items-container available-items-container",
        },
          TradeableItemsComponentFactory(
          {
            header: this.props.selfPlayer.name.fullName,
            tradeableItems: selfAvailableItems,
            isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
            onDragStart: this.handleAvailableDragStart.bind(this, "self"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: this.handleStageItem.bind(this, "self"),
          }),
          TradeableItemsComponentFactory(
          {
            header: this.props.otherPlayer.name.fullName,
            tradeableItems: otherAvailableItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: this.handleAvailableDragStart.bind(this, "other"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: this.handleStageItem.bind(this, "other"),
          }),
        ),
        React.DOM.div(
        {
          className: "tradeable-items-container trade-staging-areas-container",
        },
          TradeableItemsComponentFactory(
          {
            tradeableItems: this.state.activeTrade.ownTrade.stagedItems,
            availableItems: this.state.activeTrade.ownTrade.allItems,
            isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
            onDragStart: this.handleStagingDragStart.bind(this, "self"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: this.handleRemoveStagedItem.bind(this, "self"),
            adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "self"),
          }),
          TradeableItemsComponentFactory(
          {
            tradeableItems: this.state.activeTrade.otherTrade.stagedItems,
            availableItems: this.state.activeTrade.otherTrade.allItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: this.handleStagingDragStart.bind(this, "other"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: this.handleRemoveStagedItem.bind(this, "other"),
            adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "other"),
          }),
        ),
        React.DOM.div(
        {
          className: "trade-buttons-container tradeable-items-reset-buttons-container",
        },
          React.DOM.button(
          {
            className: "trade-button tradeable-items-reset-button",
          },
            localize("reset"),
          ),
          React.DOM.button(
          {
            className: "trade-button tradeable-items-reset-button",
          },
            localize("reset"),
          ),
        ),
        React.DOM.div(
        {
          className: "trade-buttons-container trade-controls-container",
        },
          React.DOM.button(
          {
            className: "trade-button trade-control-button",
            disabled: !ableToAcceptTrade,
          },
            localize("reject"),
          ),
          ableToAcceptTrade ?
            React.DOM.button(
            {
              className: "trade-button trade-control-button",
            },
              localize("accept"),
            ) :
            React.DOM.button(
            {
              className: "trade-button trade-control-button",
            },
              localize("propose"),
            ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TradeOverviewComponent);
export default Factory;
