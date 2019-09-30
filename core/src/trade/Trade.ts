import {Player} from "../player/Player";


export enum TradeableItemType
{
  Money,
  Resource,
}

export interface TradeableItem
{
  key: string;
  type: TradeableItemType;
  amount: number;
}
export interface TradeableItems
{
  [key: string]: TradeableItem;
}

export class Trade
{
  public allItems: TradeableItems;
  public stagedItems: TradeableItems = {};

  private player: Player;

  constructor(player: Player)
  {
    this.player = player;
    this.setAllTradeableItems();
  }

  private static tradeableItemsAreEqual(t1: TradeableItems, t2: TradeableItems): boolean
  {
    if (Object.keys(t1).length !== Object.keys(t2).length)
    {
      return false;
    }

    for (const key in t1)
    {
      if (!t2[key] || t1[key].amount !== t2[key].amount)
      {
        return false;
      }
    }

    return true;
  }

  public executeTrade(otherTrade: Trade): void
  {
    this.executeAllStagedTrades(otherTrade.player);
    otherTrade.executeAllStagedTrades(this.player);

    this.updateAfterExecutedTrade();
    otherTrade.updateAfterExecutedTrade();
  }
  public stageItem(key: string, amount: number)
  {
    if (!this.stagedItems[key])
    {
      this.stagedItems[key] =
      {
        key: key,
        type: this.allItems[key].type,
        amount: amount,
      };
    }
    else
    {
      this.stagedItems[key].amount += amount;
      if (this.stagedItems[key].amount <= 0)
      {
        this.removeStagedItem(key);
      }
    }
  }
  public setStagedItemAmount(key: string, newAmount: number)
  {
    if (newAmount <= 0)
    {
      this.removeStagedItem(key);
    }
    else
    {
      const clamped = Math.min(this.allItems[key].amount, newAmount);
      this.stagedItems[key].amount = clamped;
    }
  }
  public getItemsAvailableForTrade()
  {
    const available: TradeableItems = {};

    for (const key in this.allItems)
    {
      const stagedAmount = this.stagedItems[key] ? this.stagedItems[key].amount : 0;
      available[key] =
      {
        key: key,
        type: this.allItems[key].type,
        amount: this.allItems[key].amount - stagedAmount,
      };
    }

    return available;
  }
  public removeStagedItem(key: string)
  {
    delete this.stagedItems[key];
  }
  public removeAllStagedItems()
  {
    for (const key in this.stagedItems)
    {
      this.removeStagedItem(key);
    }
  }
  public clone()
  {
    const cloned = new Trade(this.player);

    cloned.copyStagedItemsFrom(this);

    return cloned;
  }
  public isEqualWith(t2: Trade): boolean
  {
    return Trade.tradeableItemsAreEqual(this.stagedItems, t2.stagedItems);
  }
  public isEmpty(): boolean
  {
    return Object.keys(this.stagedItems).length === 0;
  }

  private setAllTradeableItems()
  {
    this.allItems =
    {
      money:
      {
        key: "money",
        type: TradeableItemType.Money,
        amount: this.player.resources.money,
      },
    };
  }
  private handleTradeOfItem(key: string, amount: number, targetPlayer: Player)
  {
    switch (key)
    {
      case "money":
      {
        this.player.resources.money -= amount;
        targetPlayer.resources.money += amount;
      }
    }
  }
  private executeAllStagedTrades(targetPlayer: Player)
  {
    for (const key in this.stagedItems)
    {
      this.handleTradeOfItem(key, this.stagedItems[key].amount, targetPlayer);
    }
  }
  private updateAfterExecutedTrade()
  {
    this.setAllTradeableItems();
    this.removeAllStagedItems();
  }
  private copyStagedItemsFrom(toCopyFrom: Trade): void
  {
    for (const key in toCopyFrom.stagedItems)
    {
      this.stagedItems[key] =
      {
        key: key,
        type: toCopyFrom.stagedItems[key].type,
        amount: toCopyFrom.stagedItems[key].amount,
      };
    }
  }
}
