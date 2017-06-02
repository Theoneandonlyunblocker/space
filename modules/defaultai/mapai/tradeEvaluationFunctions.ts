import
{
  Trade,
  TradeableItem,
  TradeableItemType,
} from "../../../src/Trade";

export function evaluateValueOfOffer(offeredTrade: Trade): number
{
  let value = 0;

  for (let key in offeredTrade.stagedItems)
  {
    const item = offeredTrade.stagedItems[key];

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
