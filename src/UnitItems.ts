import Item from "./Item";
import {UnitAttributeAdjustments} from "./UnitAttributes";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";

import UnitItemsSaveData from "./savedata/UnitItemsSaveData";

interface ItemsBySlot
{
  [slot: string]: Item[]
}

export default class UnitItems
{
  private items: Item[] = [];

  constructor()
  {

  }

  public getAllItems(): Item[]
  {
    return this.items.slice(0);
  }
  public getItemsBySlot(): ItemsBySlot
  {
    const itemsBySlot: ItemsBySlot = {};

    this.items.forEach(item =>
    {
      const slot = item.template.slot;
      if (!itemsBySlot[slot])
      {
        itemsBySlot[slot] = [];
      }

      itemsBySlot[slot].push(item);
    });

    return itemsBySlot;
  }
  public getAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    return this.items.filter(item =>
    {
      return Boolean(item.template.attributeAdjustments)
    }).map(item =>
    {
      return item.template.attributeAdjustments;
    });
  }
  public getAbilities(): AbilityTemplate[]
  {
    return this.items.filter(item =>
    {
      return Boolean(item.template.ability)
    }).map(item =>
    {
      return item.template.ability;
    });
  }
  public getPassiveSkills(): PassiveSkillTemplate[]
  {
    return this.items.filter(item =>
    {
      return Boolean(item.template.passiveSkill)
    }).map(item =>
    {
      return item.template.passiveSkill;
    });
  }

  public addItem(toAdd: Item): void
  {
    this.items.push(toAdd);
  }
  public removeItem(toRemove: Item): void
  {
    this.items = this.items.filter(item =>
    {
      return item !== toRemove;
    })
  }
  public destroyAllItems(): void
  {
    this.items.forEach(item =>
    {
      item.unit.fleet.player.removeItem(item);
    });
  }

  public serialize(): UnitItemsSaveData
  {
    return this.items.map(item =>
    {
      return item.serialize();
    });
  }
}