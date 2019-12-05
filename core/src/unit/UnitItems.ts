import {Item} from "../items/Item";
import {UnitAttributeAdjustments} from "./UnitAttributes";

import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";
import {PassiveSkillTemplate} from "../templateinterfaces/PassiveSkillTemplate";

import {UnitItemsSaveData} from "../savedata/UnitItemsSaveData";


interface ItemsBySlot
{
  [slot: string]: Item[];
}
interface CountBySlot
{
  [slot: string]: number;
}

export class UnitItems
{
  public items: Item[] = [];
  public itemSlots: CountBySlot;

  private onAdd: (item: Item) => void;
  private onRemove: (item: Item) => void;
  private onUpdate: (changedItem: Item) => void;

  constructor(props:
  {
    itemSlots: CountBySlot;
    onAdd: (item: Item) => void;
    onRemove: (item: Item) => void;
    onUpdate: (changedItem: Item) => void;
  })
  {
    this.itemSlots = props.itemSlots;
    this.onAdd = props.onAdd;
    this.onRemove = props.onRemove;
    this.onUpdate = props.onUpdate;
  }

  public getAllItems(): Item[]
  {
    return this.items;
  }
  public getItemsAndEmptySlots(): ItemsBySlot
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

    for (const slot in this.itemSlots)
    {
      itemsBySlotWithEmptySlots[slot] = Array.from({length: this.itemSlots[slot]});
      if (itemsBySlot[slot])
      {
        itemsBySlot[slot].forEach(item =>
        {
          itemsBySlotWithEmptySlots[slot][item.positionInUnit] = item;
        });
      }
    }

    return itemsBySlotWithEmptySlots;
  }
  public getItemsForSlot(slot: string): Item[]
  {
    return this.items.filter(item => item.template.slot === slot);
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
    const itemsForSlot = this.getItemsForSlot(slot);
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
        throw new Error(`Tried to add item ${toAdd.template.type} to unit without open slots.`);
      }

      this.items.push(toAdd);

      toAdd.positionInUnit = position;

      this.onAdd(toAdd);
      this.onUpdate(toAdd);
    }
  }
  public addItem(toAdd: Item): void
  {
    const position = this.getFirstAvailablePositionForItem(toAdd);

    if (position === null)
    {
      throw new Error("Tried to add item to unit without an open slot for item.");
    }

    this.addItemAtPosition(toAdd, position);
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

    this.onRemove(toRemove);
    this.onUpdate(toRemove);
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

      if (itemsForSlot.length === 0)
      {
        return 0;
      }

      const maxPosition = this.itemSlots[item.template.slot] - 1;
      for (let i = 0; i <= maxPosition; i++)
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
