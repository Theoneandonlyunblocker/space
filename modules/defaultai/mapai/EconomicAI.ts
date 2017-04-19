import
{
  evaluateOneSidedTradeFavourability,
  evaluateValueOfOffer,
  offerItemsOfValue,
} from "./tradeEvaluationFunctions";

import
{
  Trade,
  TradeableItems,
} from "../../../src/Trade";
import {TradeResponse} from "../../../src/TradeResponse";

export class EconomicAI
{
  public respondToTradeOffer(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeResponse
  {
    const offeredValue = evaluateValueOfOffer(receivedOffer);
    const ownValue = evaluateValueOfOffer(ownTrade);

    if (offeredValue === 0 && ownValue === 0)
    {
      return(
      {
        proposedOwnTrade: ownTrade.clone(),
        proposedReceivedOffer: receivedOffer.clone(),

        willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),
        message: "please make an offer",
        willingToAccept: false,
      });
    }
    else if (offeredValue === 0)
    {
      return this.respondToDemand(receivedOffer, ownTrade);
    }
    else if (ownValue === 0)
    {
      return this.respondToGift(receivedOffer, ownTrade);
    }

    const valueRatio = offeredValue / ownValue;
    const isFavourable = valueRatio > 1;
    const valueRatioDifference = Math.abs(1 - valueRatio);

    return(
    {
      willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),

      message: "",
      willingToAccept: false
    });
  }

  private respondToDemand(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeResponse
  {

  }
  private respondToGift(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeResponse
  {

  }
  private getWillingnessToTradeItems(
    ownTrade: Trade,
  ): {[key: string]: number}
  {

  }
}
