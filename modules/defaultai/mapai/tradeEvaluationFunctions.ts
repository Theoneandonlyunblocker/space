import
{
  Trade,
  TradeableItem,
  TradeableItemType,
} from "src/trade/Trade";


export function evaluateValueOfTrade(trade: Trade): number
{
  let value = 0;

  for (const key in trade.stagedItems)
  {
    const item = trade.stagedItems[key];

    value += evaluateTradeableItemValue(item);
  }

  return value;
}
export function evaluateTradeableItemValue(item: TradeableItem): number
{
  switch (item.type)
    {
      case TradeableItemType.Money:
      {
        return item.amount;
      }
      default:
      {
        throw new Error(`Unrecognized trade item ${item}.`);
      }
    }
}
