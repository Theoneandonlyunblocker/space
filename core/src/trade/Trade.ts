import {Player} from "../player/Player";
import { Resources } from "../player/PlayerResources";
import
{
  TradeableItemType,
  TradeableResource,
} from "./TradeableItem";
import { activeModuleData } from "../app/activeModuleData";
import { clamp } from "../generic/utility";


export interface TradeableItems
{
  resources:
  {
    [key: string]: TradeableResource;
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
      switch (category)
      {
        case "resources":
        {
          this.stagedItems.resources[key] =
          {
            key: key,
            type: this.allItems[category][key].type,
            amount: amount,
            resource: activeModuleData.templates.resources.get(key),
          };
        }
      }
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
    const clamped = clamp(newAmount, 0, this.allItems[category][key].amount);
    this.stagedItems[category][key].amount = clamped;

    /* removes staged item when set to 0. worse ux imo */
    // if (newAmount <= 0)
    // {
    //   this.removeStagedItem(category, key);
    // }
    // else
    // {
    //   const clamped = Math.min(this.allItems[category][key].amount, newAmount);
    //   this.stagedItems[category][key].amount = clamped;
    // }
  }
  public getItemsAvailableForTrade(): TradeableItems
  {
    return {
      resources: Object.keys(this.allItems.resources).reduce((availableResources, resourceType) =>
      {
        const stagedAmount = this.stagedItems.resources[resourceType] ?
          this.stagedItems.resources[resourceType].amount :
          0;

        availableResources[resourceType] =
        {
          key: resourceType,
          type: TradeableItemType.Resource,
          amount: this.allItems.resources[resourceType].amount - stagedAmount,
          resource: activeModuleData.templates.resources.get(resourceType),
        };

        return availableResources;
      }, <TradeableItems["resources"]>{}),
    };
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
          resource: activeModuleData.templates.resources.get(resourceType),
        };

        return allResourceTradeables;
      }, <TradeableItems["resources"]>{}),
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
      if (this.stagedItems.resources[resourceType].amount > 0)
      {
        merged[resourceType] = this.stagedItems.resources[resourceType].amount;
      }

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
