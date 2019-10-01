import {Player} from "../player/Player";
import { Resources } from "../player/PlayerResources";


export enum TradeableItemType
{
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
  resources:
  {
    [key: string]: TradeableItem;
  };
}

export class Trade
{
  public allItems: TradeableItems;
  public readonly stagedItems: TradeableItems =
  {
    resources: {},
  };

  private player: Player;

  constructor(player: Player)
  {
    this.player = player;
    this.setAllTradeableItems();
  }

  public executeTrade(otherTrade: Trade): void
  {
    this.tradeAllStagedItems(otherTrade.player);
    otherTrade.tradeAllStagedItems(this.player);

    this.updateAfterExecutedTrade();
    otherTrade.updateAfterExecutedTrade();
  }
  public stageItem(category: keyof TradeableItems, key: string, amount: number): void
  {
    if (!this.stagedItems[category][key])
    {
      this.stagedItems[category][key] =
      {
        key: key,
        type: this.allItems[category][key].type,
        amount: amount,
      };
    }
    else
    {
      this.stagedItems[category][key].amount += amount;
      if (this.stagedItems[category][key].amount <= 0)
      {
        this.removeStagedItem(category, key);
      }
    }
  }
  public setStagedItemAmount(category: keyof TradeableItems, key: string, newAmount: number): void
  {
    if (newAmount <= 0)
    {
      this.removeStagedItem(category, key);
    }
    else
    {
      const clamped = Math.min(this.allItems[category][key].amount, newAmount);
      this.stagedItems[category][key].amount = clamped;
    }
  }
  public getItemsAvailableForTrade(): TradeableItems
  {
    const available: TradeableItems =
    {
      resources: {},
    };

    for (const category in this.allItems)
    {
      for (const key in this.allItems[category])
      {
        const stagedAmount = this.stagedItems[category][key] ? this.stagedItems[category][key].amount : 0;
        available[category][key] =
        {
          key: key,
          type: this.allItems[category][key].type,
          amount: this.allItems[category][key].amount - stagedAmount,
        };
      }
    }

    return available;
  }
  public removeStagedItem(category: keyof TradeableItems, key: string)
  {
    delete this.stagedItems[category][key];
  }
  public removeAllStagedItems(): void
  {
    for (const category in this.stagedItems)
    {
      for (const key in this.stagedItems[category])
      {
        this.removeStagedItem(<keyof TradeableItems>category, key);
      }
    }
  }
  public clone(): Trade
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
    return Object.keys(this.stagedItems).every(category =>
    {
      return Object.keys(this.stagedItems[category]).length === 0
    })
  }

  private setAllTradeableItems(): void
  {
    this.allItems =
    {
      resources: Object.keys(this.player.resources).reduce((allResourceTradeables, resourceType) =>
      {
        allResourceTradeables[resourceType] =
        {
          key: resourceType,
          type: TradeableItemType.Resource,
          amount: this.player.resources[resourceType],
        };

        return allResourceTradeables;
      }, <{[key: string]: TradeableItem}>{}),
    };
  }
  private tradeAllStagedItems(targetPlayer: Player)
  {
    this.tradeStagedResources(targetPlayer);
  }
  private tradeStagedResources(targetPlayer: Player): void
  {
    if (Object.keys(this.stagedItems.resources).length === 0)
    {
      return;
    }

    const resourcesToTrade = Object.keys(this.stagedItems.resources).reduce((merged, resourceType) =>
    {
      merged[resourceType] = this.stagedItems.resources[resourceType].amount;

      return merged;
    }, <Resources>{});

    this.player.removeResources(resourcesToTrade);
    targetPlayer.addResources(resourcesToTrade);
  }
  private updateAfterExecutedTrade(): void
  {
    this.setAllTradeableItems();
    this.removeAllStagedItems();
  }
  private copyStagedItemsFrom(toCopyFrom: Trade): void
  {
    for (const category in toCopyFrom.stagedItems)
    {
      for (const key in toCopyFrom.stagedItems[category])
      {
        this.stagedItems[category][key] = {...toCopyFrom.stagedItems[category][key]};
      }
    }
  }

  private static tradeableItemsAreEqual(t1: TradeableItems, t2: TradeableItems): boolean
  {
    return Object.keys(t1).every(category =>
    {
      if (Object.keys(t1[category]).length !== Object.keys(t1[category]).length)
      {
        return false;
      }

      return Object.keys(t1[category]).every(itemKey =>
      {
        return t2[category][itemKey] && t1[category][itemKey].amount === t1[category][itemKey].amount;
      });
    });
  }
}
