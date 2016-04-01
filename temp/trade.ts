/// <reference path="player.ts" />

export interface ITradeableItem
{
  key: string;
  amount: number;
}
export interface ITradeableItems
{
  [key: string]: ITradeableItem;
}

export class Trade
{
  allItems: ITradeableItems;
  stagedItems: ITradeableItems = {};
  player: Player;

  constructor(player: Player)
  {
    this.player = player;
    this.setAllTradeableItems();
  }
  setAllTradeableItems()
  {
    this.allItems =
    {
      money:
      {
        key: "money",
        amount: this.player.money
      }
    }
  }
  getItemsAvailableForTrade()
  {
    var available: ITradeableItems = {};

    for (var key in this.allItems)
    {
      var stagedAmount = this.stagedItems[key] ? this.stagedItems[key].amount : 0;
      available[key] =
      {
        key: key,
        amount: this.allItems[key].amount - stagedAmount
      };
    }

    return available;
  }
  removeStagedItem(key: string)
  {
    this.stagedItems[key] = null;
    delete this.stagedItems[key];
  }
  removeAllStagedItems()
  {
    for (var key in this.stagedItems)
    {
      this.removeStagedItem(key);
    }
  }
  stageItem(key: string, amount: number)
  {
    if (!this.stagedItems[key])
    {
      this.stagedItems[key] =
      {
        key: key,
        amount: amount
      }
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
  setStagedItemAmount(key: string, newAmount: number)
  {
    if (newAmount <= 0)
    {
      this.removeStagedItem(key);
    }
    else
    {
      var clamped = Math.min(this.allItems[key].amount, newAmount);
      this.stagedItems[key].amount = clamped;
    }
  }
  handleTradeOfItem(key: string, amount: number, targetPlayer: Player)
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
  executeAllStagedTrades(targetPlayer: Player)
  {
    for (var key in this.stagedItems)
    {
      this.handleTradeOfItem(key, this.stagedItems[key].amount, targetPlayer);
    }
  }
  updateAfterExecutedTrade()
  {
    this.setAllTradeableItems();
    this.removeAllStagedItems();
  }
}
