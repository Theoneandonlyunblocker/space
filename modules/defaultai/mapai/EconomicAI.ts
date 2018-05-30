import
{
  Trade,
} from "../../../src/Trade";
import {TradeOffer} from "../../../src/TradeOffer";
import {localize} from "../localization/localize";

import
{
  evaluateValueOfTrade,
} from "./tradeEvaluationFunctions";


export class EconomicAI
{
  public respondToTradeOffer(
    incomingOffer: TradeOffer,
  ): TradeOffer
  {
    // the offer is from the other player's perspective, so these are flipped
    const tradeBeingReceived = incomingOffer.ownTrade;
    const tradeBeingDemanded = incomingOffer.otherTrade;

    const receivingValue = evaluateValueOfTrade(tradeBeingReceived);
    const demandingValue = evaluateValueOfTrade(tradeBeingDemanded);

    if (receivingValue === 0 && demandingValue === 0)
    {
      let message: string;

      if (incomingOffer.tradeWasAccepted)
      {
        message = localize("afterAcceptedOffer")();
      }
      else if (incomingOffer.isInitialOffer)
      {
        message = localize("initialOffer")();
      }
      else
      {
        message = localize("requestOffer")();
      }

      return(
      {
        ownTrade: tradeBeingDemanded.clone(),
        otherTrade: tradeBeingReceived.clone(),

        willingnessToTradeItems: this.getWillingnessToTradeItems(tradeBeingDemanded),

        message: message,
        willingToAccept: false,
        willingToKeepNegotiating: true,
      });
    }
    else if (receivingValue === 0)
    {
      return this.respondToDemand(tradeBeingReceived, tradeBeingDemanded);
    }
    else if (demandingValue === 0)
    {
      return this.respondToGift(tradeBeingReceived, tradeBeingDemanded);
    }

    const valueRatio = receivingValue / demandingValue;
    const isFavourable = valueRatio > 1;
    const valueRatioDifference = Math.abs(1 - valueRatio);

    const willingToAccept = isFavourable || valueRatioDifference < 0.04;

    return(
    {
      ownTrade: tradeBeingDemanded.clone(),
      otherTrade: tradeBeingReceived.clone(),

      willingnessToTradeItems: this.getWillingnessToTradeItems(tradeBeingDemanded),

      message: willingToAccept ?
      localize("willingToAcceptOffer")() :
      localize("notWillingToAcceptOffer")(),
      willingToAccept: willingToAccept,
      willingToKeepNegotiating: true,
    });
  }

  private respondToDemand(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeOffer
  {
    return(
    {
      ownTrade: ownTrade.clone(),
      otherTrade: receivedOffer.clone(),

      willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),

      message: localize("notWillingToAcceptDemand")(),
      willingToAccept: false,
      willingToKeepNegotiating: true,
    });
  }
  private respondToGift(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeOffer
  {
    return(
    {
      ownTrade: ownTrade.clone(),
      otherTrade: receivedOffer.clone(),

      willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),

      message: localize("willingToAcceptGift")(),
      willingToAccept: true,
      willingToKeepNegotiating: true,
    });
  }
  private getWillingnessToTradeItems(
    ownTrade: Trade,
  ): {[key: string]: number}
  {
    // TODO 2017.04.25 | unimplemented
    const willingnessPerItem: {[key: string]: number} = {};

    for (const key in ownTrade.allItems)
    {
      willingnessPerItem[key] = 1;
    }

    return willingnessPerItem;
  }
}
