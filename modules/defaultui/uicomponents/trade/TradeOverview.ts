import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Player} from "../../../../src/player/Player";
import {Trade} from "../../../../src/trade/Trade";
import
{
  cloneTradeOffer,
  flipTradeOffer,
  TradeOffer,
} from "../../../../src/trade/TradeOffer";

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
      currentDragItemKey: null,
      currentDragItemPlayer: null,
      currentDragItemWasStaged: null,
      activeOffer: activeOffer,
      lastOfferByPlayer: cloneTradeOffer(activeOffer),
      hasActiveProposal: false,
    };

    this.bindMethods();
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
            onDragStart: this.handleAvailableDragStart.bind(this, "self"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: this.handleStageItem.bind(this, "self"),
          }),
          TradeableItems(
          {
            header: this.props.otherPlayer.name.baseName,
            tradeableItems: otherAvailableItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: this.handleAvailableDragStart.bind(this, "other"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleAvailableMouseUp,
            onItemClick: this.handleStageItem.bind(this, "other"),
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
            onDragStart: this.handleStagingDragStart.bind(this, "self"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: this.handleRemoveStagedItem.bind(this, "self"),
            adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "self"),
          }),
          TradeableItems(
          {
            tradeableItems: this.state.activeOffer.otherTrade.stagedItems,
            availableItems: this.state.activeOffer.otherTrade.allItems,
            isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
            onDragStart: this.handleStagingDragStart.bind(this, "other"),
            onDragEnd: this.handleDragEnd,
            onMouseUp: this.handleStagingAreaMouseUp,
            onItemClick: this.handleRemoveStagedItem.bind(this, "other"),
            adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "other"),
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
            localize("reset")(),
          ),
          ReactDOMElements.button(
          {
            className: "trade-button tradeable-items-reset-button",
            disabled: this.state.activeOffer.otherTrade.isEqualWith(this.state.lastOfferByPlayer.otherTrade),
            onClick: this.resetOtherTrade,
          },
            localize("reset")(),
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
            localize("reject")(),
          ),
          this.state.hasActiveProposal ?
            ReactDOMElements.button(
            {
              className: "trade-button trade-control-button",
              disabled: !ableToAcceptTrade,
              onClick: this.acceptTrade,
            },
              localize("accept")(),
            ) :
            ReactDOMElements.button(
            {
              className: "trade-button trade-control-button",
              disabled: !this.state.activeOffer.willingToKeepNegotiating,
              onClick: this.proposeTrade,
            },
              localize("propose")(),
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
  private handleStageItem(player: "self" | "other", key: string)
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
      activeTrade.stageItem(key, availableAmount);
    }

    this.onTradeChange();
  }
  private handleAdjustStagedItemAmount(player: "self" | "other", key: string, newAmount: number)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    activeTrade.setStagedItemAmount(key, newAmount);

    this.onTradeChange();
  }
  private handleRemoveStagedItem(player: "self" | "other", key: string)
  {
    const activeTrade = this.getActiveTradeObjectForPlayer(player);
    activeTrade.removeStagedItem(key);

    this.onTradeChange();
  }
  private handleAvailableDragStart(player: "self" | "other", key: string)
  {
    this.setState(
    {
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: false,
    });
  }
  private handleStagingDragStart(player: "self" | "other", key: string)
  {
    this.setState(
    {
      currentDragItemKey: key,
      currentDragItemPlayer: player,
      currentDragItemWasStaged: true,
    });
  }
  private handleDragEnd()
  {
    this.setState(
    {
      currentDragItemKey: null,
      currentDragItemPlayer: null,
      currentDragItemWasStaged: null,
    });
  }
  private handleAvailableMouseUp()
  {
    if (this.state.currentDragItemKey && this.state.currentDragItemWasStaged)
    {
      this.handleDragEnd();
      this.handleRemoveStagedItem(this.state.currentDragItemPlayer!, this.state.currentDragItemKey);
    }
  }
  private handleStagingAreaMouseUp()
  {
    if (this.state.currentDragItemKey && !this.state.currentDragItemWasStaged)
    {
      this.handleDragEnd();
      this.handleStageItem(this.state.currentDragItemPlayer!, this.state.currentDragItemKey);
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
}

export const TradeOverview: React.Factory<PropTypes> = React.createFactory(TradeOverviewComponent);
