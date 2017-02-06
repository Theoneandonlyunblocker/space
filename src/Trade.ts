import Player from "./Player";

export interface TradeableItem
{
  key: string;
  amount: number;
}
export interface TradeableItems
{
  [key: string]: TradeableItem;
}

export default class Trade
{
  allItems: TradeableItems;
  stagedItems: TradeableItems = {};
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
        amount: this.player.money,
      },
    };
  }
  getItemsAvailableForTrade()
  {
    var available: TradeableItems = {};

    for (let key in this.allItems)
    {
      var stagedAmount = this.stagedItems[key] ? this.stagedItems[key].amount : 0;
      available[key] =
      {
        key: key,
        amount: this.allItems[key].amount - stagedAmount,
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
    for (let key in this.stagedItems)
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
    for (let key in this.stagedItems)
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
