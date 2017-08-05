import Item from "./Item";
import {UnitAttributeAdjustments} from "./UnitAttributes";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import UnitItemsSaveData from "./savedata/UnitItemsSaveData";

interface ItemsBySlot
{
  [slot: string]: Item[];
}
interface CountBySlot
{
  [slot: string]: number;
}

export default class UnitItems
{
  public items: Item[] = [];
  public itemSlots: CountBySlot;

  private addItemToUnit: (item: Item) => void;
  private updateUnit: (changedItem: Item) => void;

  constructor(
    itemSlots: CountBySlot,
    addItemToUnit: (item: Item) => void,
    updateUnit: (changedItem: Item) => void,
  )
  {
    this.itemSlots = itemSlots;
    this.addItemToUnit = addItemToUnit;
    this.updateUnit = updateUnit;
  }

  public getAllItems(): Item[]
  {
    return this.items;
  }
  public getItemsBySlot(): ItemsBySlot
  {
    const itemsBySlot: ItemsBySlot = {};
    const allItems = this.getAllItems();

    allItems.forEach(item =>
    {
      if (!itemsBySlot[item.template.slot])
      {
        itemsBySlot[item.template.slot] = [];
      }

      itemsBySlot[item.template.slot].push(item);
    });

    const itemsBySlotWithEmptySlots: ItemsBySlot = {};

    for (let slot in this.itemSlots)
    {
      itemsBySlotWithEmptySlots[slot] = itemsBySlot[slot] || [];
    }

    return itemsBySlotWithEmptySlots;
  }
  public getItemsForSlot(slot: string): Item[]
  {
    return this.getItemsBySlot()[slot];
  }
  public getAmountOfAvailableItemSlots(slot: string): number
  {
    return this.itemSlots[slot] - this.getItemsForSlot(slot).length;
  }
  public getAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.attributeAdjustments);
    }).map(item =>
    {
      return item.template.attributeAdjustments!;
    });
  }
  public getAbilities(): AbilityTemplate[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.ability);
    }).map(item =>
    {
      return item.template.ability!;
    });
  }
  public getPassiveSkills(): PassiveSkillTemplate[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.passiveSkill);
    }).map(item =>
    {
      return item.template.passiveSkill!;
    });
  }

  public hasSlotForItem(item: Item): boolean
  {
    return this.getAmountOfAvailableItemSlots(item.template.slot) > 0;
  }
  public getItemAtPosition(slot: string, position: number): Item | null
  {
    const itemsForSlot = this.getItemsBySlot()[slot];
    for (let i = 0; i < itemsForSlot.length; i++)
    {
      if (itemsForSlot[i].positionInUnit === position)
      {
        return itemsForSlot[i];
      }
    }

    return null;
  }
  public hasItem(item: Item): boolean
  {
    return this.indexOf(item) !== -1;
  }
  public addItemAtPosition(toAdd: Item, position: number): void
  {
    const oldItemAtTargetPosition = this.getItemAtPosition(
      toAdd.template.slot, position);
    if (this.hasItem(toAdd))
    {
      const oldPositionForItem = toAdd.positionInUnit!;

      if (oldItemAtTargetPosition)
      {
        this.moveItem(oldItemAtTargetPosition, oldPositionForItem);
      }

      this.moveItem(toAdd, position);
    }
    else
    {
      if (toAdd.unit)
      {
        toAdd.unit.items.removeItem(toAdd);
      }

      if (oldItemAtTargetPosition)
      {
        this.removeItem(oldItemAtTargetPosition);
      }

      if (!this.hasSlotForItem(toAdd))
      {
        throw new Error("");
      }

      this.items.push(toAdd);

      toAdd.positionInUnit = position;

      this.addItemToUnit(toAdd);
      this.updateUnit(toAdd);
    }
  }
  // TODO 2017.08.05 | remove. use addItemAtPosition instead
  public addItem(toAdd: Item): void
  {
    this.addItemAtPosition(toAdd, this.getFirstAvailablePositionForItem(toAdd));
  }
  public moveItem(toMove: Item, newPosition: number): void
  {
    toMove.positionInUnit = newPosition;
  }
  public removeItem(toRemove: Item): void
  {
    if (!this.hasItem(toRemove))
    {
      throw new Error("");
    }

    this.items.splice(this.indexOf(toRemove), 1);

    toRemove.unit = undefined;
    toRemove.positionInUnit = undefined;

    this.updateUnit(toRemove);
  }
  public destroyAllItems(): void
  {
    this.getAllItems().forEach(item =>
    {
      item.unit!.fleet.player.removeItem(item);
    });
  }

  public serialize(): UnitItemsSaveData
  {
    return(
    {
      maxItemSlots: this.itemSlots,
      itemIds: this.items.map(item => item.id),
    });
  }

  private indexOf(item: Item): number
  {
    return this.items.indexOf(item);
  }
  private getFirstAvailablePositionForItem(item: Item): number | null
  {
    if (!this.hasSlotForItem(item))
    {
      return null;
    }
    else
    {
      const itemsForSlot = this.getItemsForSlot(item.template.slot).sort((a, b) =>
      {
        return a.positionInUnit! - b.positionInUnit!;
      });

      const maxPosition = this.itemSlots[item.template.slot] - 1;
      for (let i = 0; i < maxPosition; i++)
      {
        if (itemsForSlot[i].positionInUnit !== i)
        {
          return i;
        }
      }
    }

    throw new Error("Couldn't find available slot for item");
  }
}
