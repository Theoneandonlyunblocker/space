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

  message: string;
  willingToAccept: boolean;
}
