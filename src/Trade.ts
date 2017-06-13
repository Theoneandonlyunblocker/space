import Player from "./Player";

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

    for (let key in this.allItems)
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
    this.stagedItems[key] = null;
    delete this.stagedItems[key];
  }
  public removeAllStagedItems()
  {
    for (let key in this.stagedItems)
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

  private setAllTradeableItems()
  {
    this.allItems =
    {
      money:
      {
        key: "money",
        type: TradeableItemType.Money,
        amount: this.player.money,
      },
    };
  }
  private handleTradeOfItem(key: string, amount: number, targetPlayer: Player)
  {
    switch (key)
    {
      case "money":
      {
        this.player.money -= amount;
        targetPlayer.money += amount;
      }
    }
  }
  private executeAllStagedTrades(targetPlayer: Player)
  {
    for (let key in this.stagedItems)
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
    for (let key in toCopyFrom.stagedItems)
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
