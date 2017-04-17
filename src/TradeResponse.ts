import Trade from "./Trade";

export interface TradeResponse
{
  originalOwnTrade: Trade;
  proposedOwnTrade: Trade;
  originalReceivedOffer: Trade;
  proposedReceivedOffer: Trade;

  /**
   * scale of 0-1.
   * for the amount in proposedOwnTrade if item is included
   * else for Math.ceil(0.33 * availableItems) ?
   */
  willingnessToTradeItems:
  {
    [tradeItemKey: string]: number;
  };

  message: string;
  willingToAccept: boolean;
}
