import {Trade} from "core/src/trade/Trade";
import {TradeableResource} from "core/src/trade/TradeableItem";


export function evaluateValueOfTrade(trade: Trade): number
{
  let value = 0;

  for (const resourceType in trade.stagedItems.resources)
  {
    value += evaluateResourceValue(trade.stagedItems.resources[resourceType]);
  }

  return value;
}
function evaluateResourceValue(item: TradeableResource): number
{
  return item.amount * item.resource.baseValuableness;
}
