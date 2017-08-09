import {Trade} from "./Trade";


export interface TradeOffer
{
  ownTrade: Trade;
  otherTrade: Trade;

  /**
   * scale of 0-1.
   * for the amount in ownTrade if item is included
   * else for Math.ceil(0.33 * availableItems) ?
   */
  willingnessToTradeItems:
  {
    [tradeItemKey: string]: number;
  };

  isInitialOffer?: boolean;
  tradeWasAccepted?: boolean;
  message: string;
  willingToAccept: boolean;
  willingToKeepNegotiating: boolean;
}

export function cloneTradeOffer(offer: TradeOffer): TradeOffer
{
  return(
  {
    ownTrade: offer.ownTrade.clone(),
    otherTrade: offer.otherTrade.clone(),

    willingnessToTradeItems: {...offer.willingnessToTradeItems},

    message: offer.message,
    willingToAccept: offer.willingToAccept,
    willingToKeepNegotiating: offer.willingToKeepNegotiating,
  });
}

export function flipTradeOffer(offer: TradeOffer): void
{
  const tempOwn = offer.ownTrade;

  offer.ownTrade = offer.otherTrade;
  offer.otherTrade = tempOwn;
}
