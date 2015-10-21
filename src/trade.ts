/// <reference path="player.ts" />

module Rance
{
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
        },
        test1:
        {
          key: "test1",
          amount: 1
        },
        test2:
        {
          key: "test2",
          amount: 2
        },
        test3:
        {
          key: "test3",
          amount: 3
        },
        test4:
        {
          key: "test4",
          amount: 4
        },
        test5:
        {
          key: "test5",
          amount: 5
        },
        test6:
        {
          key: "test6",
          amount: 6
        },
        test7:
        {
          key: "test7",
          amount: 7
        },
        test8:
        {
          key: "test8",
          amount: 8
        },
        test9:
        {
          key: "test9",
          amount: 9
        },
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
  }
}
