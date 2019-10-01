import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Player} from "core/src/player/Player";
import {Trade, TradeableItems as TradeableItemsType} from "core/src/trade/Trade";
import
{
  cloneTradeOffer,
  flipTradeOffer,
  TradeOffer,
} from "core/src/trade/TradeOffer";

import {TradeableItems} from "./TradeableItems";


export interface PropTypes extends React.Props<any>
{
  selfPlayer: Player;
  otherPlayer: Player;
  initialReceivedOffer?: TradeOffer;
  handleClose: () => void;
}

interface StateType
{
  currentDragItemCategory: keyof TradeableItemsType | null;
  currentDragItemKey: string | null;
  currentDragItemPlayer: "self" | "other" | null;
  currentDragItemWasStaged: boolean | null;
  activeOffer: TradeOffer;
  lastOfferByPlayer: TradeOffer;
  hasActiveProposal: boolean;
}

export class TradeOverviewComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "TradeOverview";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    let activeOffer: TradeOffer;

    if (this.props.initialReceivedOffer)
    {
      activeOffer = this.props.initialReceivedOffer;
    }
    else
    {
      const initialHumanOffer = TradeOverviewComponent.makeInitialHumanTradeOffer(props.selfPlayer, props.otherPlayer);
      const initialResponse = this.props.otherPlayer.aiController.respondToTradeOffer(initialHumanOffer);

      activeOffer = initialResponse;
    }

    flipTradeOffer(activeOffer);

    this.state =
    {
      currentDragItemCategory: null,
      currentDragItemKey: null,
      currentDragItemPlayer: null,
      currentDragItemWasStaged: null,
      activeOffer: activeOffer,
      lastOfferByPlayer: cloneTradeOffer(activeOffer),
      hasActiveProposal: false,
    };

    this.bindMethods();
  }

  public render()
  {
    const hasDragItem = Boolean(this.state.currentDragItemKey);
    const selfPlayerAcceptsDrop = this.state.currentDragItemPlayer === "self";
    const otherPlayerAcceptsDrop = this.state.currentDragItemPlayer === "other";
    const selfAvailableItems = this.state.activeOffer.ownTrade.getItemsAvailableForTrade();
    const otherAvailableItems = this.state.activeOffer.otherTrade.getItemsAvailableForTrade();

    const ableToAcceptTrade = this.state.hasActiveProposal && this.state.activeOffer.willingToAccept;

    return(
      ReactDOMElements.div(
      {
        className: "trade-overview",
      },
        ReactDOMElements.div(
        {
          className: "tradeable-items-container available-items-container",
        },
          TradeableItems(
          {
            header: this.props.selfPlayer.name.baseName,
            tradeableItems: selfAvailableItems,
            isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
            onDragStart: (category, key) => this.handleAvailableDragStart("self", category, key),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: (category, key) => this.handleStageItem("self", category, key),
            shouldGroupCategories: true,
          }),
          TradeableItems(
          {
            header: this.props.otherPlayer.name.baseName,
            tradeableItems: otherAvailableItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: (category, key) => this.handleAvailableDragStart("other", category, key),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: (category, key) => this.handleStageItem("other", category, key),
            shouldGroupCategories: true,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "tradeable-items-container trade-staging-areas-container",
        },
          TradeableItems(
          {
            tradeableItems: this.state.activeOffer.ownTrade.stagedItems,
            availableItems: this.state.activeOffer.ownTrade.allItems,
            isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
            onDragStart: (category, key) => this.handleStagingDragStart("self", category, key),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: (category, key) => this.handleRemoveStagedItem("self", category, key),
            adjustItemAmount: (category, key, amount) => this.handleAdjustStagedItemAmount("self", category, key, amount),
            shouldGroupCategories: false,
          }),
          TradeableItems(
          {
            tradeableItems: this.state.activeOffer.otherTrade.stagedItems,
            availableItems: this.state.activeOffer.otherTrade.allItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: (category, key) => this.handleStagingDragStart("other", category, key),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: (category, key) => this.handleRemoveStagedItem("other", category, key),
            adjustItemAmount: (category, key, amount) => this.handleAdjustStagedItemAmount("other", category, key, amount),
            shouldGroupCategories: false,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "trade-buttons-container tradeable-items-reset-buttons-container",
        },
          ReactDOMElements.button(
          {
            className: "trade-button tradeable-items-reset-button",
            disabled: this.state.activeOffer.ownTrade.isEqualWith(this.state.lastOfferByPlayer.ownTrade),
            onClick: this.resetSelfTrade,
          },
            localize("reset").toString(),
          ),
          ReactDOMElements.button(
          {
            className: "trade-button tradeable-items-reset-button",
            disabled: this.state.activeOffer.otherTrade.isEqualWith(this.state.lastOfferByPlayer.otherTrade),
            onClick: this.resetOtherTrade,
          },
            localize("reset").toString(),
          ),
        ),
        ReactDOMElements.div(
        {
          className: "trade-message",
        },
          this.state.activeOffer.message,
        ),
        ReactDOMElements.div(
        {
          className: "trade-buttons-container trade-controls-container",
        },
          ReactDOMElements.button(
          {
            className: "trade-button trade-control-button",
            disabled: !ableToAcceptTrade,
            onClick: this.rejectTrade,
          },
            localize("reject").toString(),
          ),
          this.state.hasActiveProposal ?
            ReactDOMElements.button(
            {
              className: "trade-button trade-control-button",
              disabled: !ableToAcceptTrade,
              onClick: this.acceptTrade,
            },
              localize("accept").toString(),
            ) :
            ReactDOMElements.button(
            {
              className: "trade-button trade-control-button",
              disabled: !this.state.activeOffer.willingToKeepNegotiating,
              onClick: this.proposeTrade,
            },
              localize("propose").toString(),
            ),
        ),
      )
    );
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
    this.getActiveTradeObjectForPlayer = this.getActiveTradeObjectForPlayer.bind(this);
    this.resetSelfTrade = this.resetSelfTrade.bind(this);
    this.resetOtherTrade = this.resetOtherTrade.bind(this);
    this.acceptTrade = this.acceptTrade.bind(this);
    this.proposeTrade = this.proposeTrade.bind(this);
    this.rejectTrade = this.rejectTrade.bind(this);
  }
  private getActiveTradeObjectForPlayer(player: "self" | "other"): Trade
  {
    if (player === "self")
    {
      return this.state.activeOffer.ownTrade;
    }
    else if (player === "other")
    {
      return this.state.activeOffer.otherTrade;
    }
    else
    {
      throw new Error(`Invalid player key '${player}'`);
    }
  }
  private handleStageItem(player: "self" | "other", category: keyof TradeableItemsType, key: string)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);

    const availableItems = activeTrade.getItemsAvailableForTrade();
    const availableAmount = availableItems[category][key].amount;

    if (availableAmount === 1)
    {
      activeTrade.stageItem(category, key, 1);
    }
    else
    {
      activeTrade.stageItem(category, key, availableAmount);
    }

    this.onTradeChange();
  }
  private handleAdjustStagedItemAmount(player: "self" | "other", category: keyof TradeableItemsType, key: string, newAmount: number)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    activeTrade.setStagedItemAmount(category, key, newAmount);

    this.onTradeChange();
  }
  private handleRemoveStagedItem(player: "self" | "other", category: keyof TradeableItemsType, key: string)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    activeTrade.removeStagedItem(category, key);

    this.onTradeChange();
  }
  private handleAvailableDragStart(player: "self" | "other", category: keyof TradeableItemsType, key: string)
  {
    this.setState(
    {
      currentDragItemCategory: category,
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: false,
    });
  }
  private handleStagingDragStart(player: "self" | "other", category: keyof TradeableItemsType, key: string)
  {
    this.setState(
    {
      currentDragItemCategory: category,
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: true,
    });
  }
  private handleDragEnd()
  {
    this.setState(
    {
      currentDragItemCategory: null,
      currentDragItemKey: null,
      currentDragItemPlayer: null,
      currentDragItemWasStaged: null,
    });
  }
  private handleAvailableMouseUp()
  {
    if (this.state.currentDragItemKey && this.state.currentDragItemWasStaged)
    {
      this.handleRemoveStagedItem(this.state.currentDragItemPlayer!, this.state.currentDragItemCategory, this.state.currentDragItemKey);
      this.handleDragEnd();
    }
  }
  private handleStagingAreaMouseUp()
  {
    if (this.state.currentDragItemKey && !this.state.currentDragItemWasStaged)
    {
      this.handleStageItem(this.state.currentDragItemPlayer!, this.state.currentDragItemCategory, this.state.currentDragItemKey);
      this.handleDragEnd();
    }
  }
  private onTradeChange(): void
  {
    if (this.state.hasActiveProposal)
    {
      this.setState({hasActiveProposal: false});
    }
    else
    {
      this.forceUpdate();
    }
  }
  private resetSelfTrade(): void
  {
    this.state.activeOffer.ownTrade = this.state.lastOfferByPlayer.ownTrade.clone();

    this.onTradeChange();
  }
  private resetOtherTrade(): void
  {
    this.state.activeOffer.otherTrade = this.state.lastOfferByPlayer.otherTrade.clone();

    this.onTradeChange();
  }
  private acceptTrade(): void
  {
    this.state.activeOffer.ownTrade.executeTrade(this.state.activeOffer.otherTrade);
    this.state.activeOffer.tradeWasAccepted = true;

    const response = this.props.otherPlayer.aiController.respondToTradeOffer(this.state.activeOffer);
    flipTradeOffer(response);

    this.setState(
    {
      activeOffer: response,
      lastOfferByPlayer: cloneTradeOffer(response),
      hasActiveProposal: false,
    });
  }
  private proposeTrade(): void
  {
    const response = this.props.otherPlayer.aiController.respondToTradeOffer(this.state.activeOffer);
    flipTradeOffer(response);

    this.setState(
    {
      activeOffer: response,
      lastOfferByPlayer: cloneTradeOffer(response),
      hasActiveProposal: true,
    });
  }
  private rejectTrade(): void
  {
    this.resetSelfTrade();
    this.resetOtherTrade();
  }

  private static makeInitialHumanTradeOffer(selfPlayer: Player, otherPlayer: Player): TradeOffer
  {
    const ownTrade = new Trade(selfPlayer);

    // TODO 2017.04.25 | smarter way to do this for human player
    const willingnessToTradeItems: {[key: string]: number} = {};
    for (const key in ownTrade.allItems)
    {
      willingnessToTradeItems[key] = 1;
    }

    return(
    {
      ownTrade: ownTrade,
      otherTrade: new Trade(otherPlayer),
      willingnessToTradeItems: willingnessToTradeItems,
      isInitialOffer: true,
      message: "",
      willingToAccept: false,
      willingToKeepNegotiating: true,
    });
  }
}

export const TradeOverview: React.Factory<PropTypes> = React.createFactory(TradeOverviewComponent);
