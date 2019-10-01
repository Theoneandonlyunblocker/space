import
{
  Trade,
  TradeableItem,
} from "core/src/trade/Trade";


export function evaluateValueOfTrade(trade: Trade): number
{
  let value = 0;

  for (const resourceType in trade.stagedItems.resources)
  {
    value += evaluateResourceValue(trade.stagedItems.resources[resourceType]);
  }

  return value;
}
function evaluateResourceValue(item: TradeableItem): number
{
  // TODO 2019.10.01 | implement
  return item.amount;
}
