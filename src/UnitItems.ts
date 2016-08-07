import app from "./App"; // TODO refactor

import Item from "./Item";
import {UnitAttributeAdjustments} from "./UnitAttributes";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import UnitItemsSaveData from "./savedata/UnitItemsSaveData";
import ItemSaveData from "./savedata/ItemSaveData";

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
  // public itemsBySlot: ItemsBySlot = {};
  public items: Item[] = [];
  public itemSlots: CountBySlot;

  private addItemToUnit: (item: Item) => void;
  private updateUnit: (changedItem: Item) => void;

  constructor(
    itemSlots: CountBySlot,
    addItemToUnit: (item: Item) => void,
    updateUnit: (changedItem: Item) => void
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
  public getAvailableItemSlots(): CountBySlot
  {
    const availableSlots: CountBySlot = {};
    const itemsBySlot = this.getItemsBySlot();

    for (let slot in this.itemSlots)
    {
      availableSlots[slot] = this.itemSlots[slot] - itemsBySlot[slot].length;
    }

    return availableSlots;
  }
  public getAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.attributeAdjustments)
    }).map(item =>
    {
      return item.template.attributeAdjustments;
    });
  }
  public getAbilities(): AbilityTemplate[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.ability)
    }).map(item =>
    {
      return item.template.ability;
    });
  }
  public getPassiveSkills(): PassiveSkillTemplate[]
  {
    return this.getAllItems().filter(item =>
    {
      return Boolean(item.template.passiveSkill)
    }).map(item =>
    {
      return item.template.passiveSkill;
    });
  }

  public hasSlotForItem(item: Item): boolean
  {
    return this.getAvailableItemSlots()[item.template.slot] > 0;
  }
  public getItemAtPosition(slot: string, position: number): Item
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
  public addItem(toAdd: Item, position: number): void
  {
    const oldItemAtTargetPosition = this.getItemAtPosition(
      toAdd.template.slot, position);
    if (this.hasItem(toAdd))
    {
      const oldPositionForItem = toAdd.positionInUnit;
      
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

    toRemove.unit = null;
    toRemove.positionInUnit = null;

    this.updateUnit(toRemove);
  }
  public destroyAllItems(): void
  {
    this.getAllItems().forEach(item =>
    {
      item.unit.fleet.player.removeItem(item);
    });
  }

  public serialize(): UnitItemsSaveData
  {
    return(
    {
      maxItemSlots: this.itemSlots
    });
  }
  public serializeItems(): ItemSaveData[]
  {
    return this.items.map(item =>
    {
      return item.serialize();
    });
  }

  private indexOf(item: Item): number
  {
    return this.items.indexOf(item);
  }
}