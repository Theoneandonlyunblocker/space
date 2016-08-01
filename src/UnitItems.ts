import app from "./App"; // TODO refactor

import Item from "./Item";
import {UnitAttributeAdjustments} from "./UnitAttributes";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import UnitItemsSaveData from "./savedata/UnitItemsSaveData";

interface ItemsBySlot
{
  [slot: string]: Item[]
}
interface CountBySlot
{
  [slot: string]: number;
}

export default class UnitItems
{
  [a: number]: string; // TODO remove
  public itemsBySlot: ItemsBySlot = {};

  constructor()
  {
  }
  public static fromTemplate(itemSlots: CountBySlot): UnitItems
  {
    const unitItems = new UnitItems();
    for (let slot in itemSlots)
    {
      unitItems.itemsBySlot[slot] = [];
      for (let i = 0; i < itemSlots[slot]; i++)
      {
        unitItems.itemsBySlot[slot].push(null);
      }
    }

    return unitItems;
  }
  public static fromData(saveData: UnitItemsSaveData): UnitItems
  {
    const unitItems = new UnitItems();
    for (let slot in saveData)
    {
      unitItems.itemsBySlot[slot] = saveData[slot].map(item =>
      {
        if (!item)
        {
          return null;
        }
        else
        {
          return new Item(app.moduleData.Templates.Items[item.templateType], item.id);
        }
      });
    }

    return unitItems;
  }

  public getAllItems(): Item[]
  {
    const allItems: Item[] = [];

    for (let slot in this.itemsBySlot)
    {
      allItems.push(...this.itemsBySlot[slot].filter(item => Boolean(item)));
    }

    return allItems;
  }
  public getAvailableItemSlots(): CountBySlot
  {
    const availableSlots: CountBySlot = {};

    for (let slot in this.itemsBySlot)
    {
      availableSlots[slot] = this.itemsBySlot[slot].reduce(item =>
      {
        return Boolean(item) ? 0 : 1;
      }, 0);
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

  public addItem(toAdd: Item, index: number): void
  {
    this.itemsBySlot[toAdd.template.slot][index] = toAdd;
  }
  public removeItem(toRemove: Item): void
  {
    this.itemsBySlot[toRemove.template.slot][this.indexOf(toRemove)] = null;
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
    const saveData: UnitItemsSaveData = {};

    for (let slot in this.itemsBySlot)
    {
      saveData[slot] = this.itemsBySlot[slot].map(item =>
      {
        if (!item)
        {
          return null;
        }
        else
        {
          return item.serialize();
        }
      });
    }

    return saveData;
  }

  private indexOf(item: Item): number
  {
    if (!this.itemsBySlot[item.template.slot])
    {
      return -1;
    }

    return this.itemsBySlot[item.template.slot].indexOf(item);
  }
}