import {Trade} from "./Trade";

// TODO 2017.04.25 | probably rename this.
// meant to be used as general protocol for trading communication
export interface TradeResponse
{
  proposedOwnTrade: Trade;
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
