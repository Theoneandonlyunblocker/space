import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";
import { ItemModifier } from "./ItemModifier";
import { Item } from "../items/Item";
import { Unit } from "../unit/Unit";
import { SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { app } from "../app/App";
import { Player } from "../player/Player";


export class ItemModifiersCollection extends MapLevelModifiersCollection<ItemModifier>
{
  private item: Item;
  private get unit(): Unit | undefined
  {
    return this.item.unit;
  }
  private get owner(): Player | undefined
  {
    return this.item.owner;
  }

  constructor(item: Item)
  {
    super();

    this.item = item;
  }

  public handleConstruct(): void
  {
    if (this.item.template.mapLevelModifiers)
    {
      this.addOriginatingModifiers(...this.item.template.mapLevelModifiers);
    }
  }
  public setModifiersForUnit(): void
  {
    this.propagateModifiersOfTypeTo("equippingUnit", this.unit.mapLevelModifiers);
  }
  public clearModifiersForUnit(): void
  {
    this.removePropagationsTo(this.unit.mapLevelModifiers);
  }
  // items dont change owners or get destroyed right now
  // public setModifiersForOwner(): void
  // {
  //   this.propagateModifiersOfTypeTo("owningPlayer", this.owner.modifiers);
  // }
  // public clearModifiersForOwner(): void
  // {
  //   this.removePropagationsTo(this.owner.modifiers);
  // }
  // public handleDestroy(): void
  // {
  //   this.removeAllModifiers();
  // }

  protected templateShouldBeActive(modifier: ItemModifier): boolean
  {
    return true;
  }
  protected getPropagationsForTemplate(toPropagate: ItemModifier)
  {
    const propagations: SimpleMapLevelModifiersPropagation<ItemModifier>[] = [];

    if (toPropagate.propagations && toPropagate.propagations.equippingUnit && this.unit)
    {
      propagations.push(...toPropagate.propagations.equippingUnit.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: this.unit.mapLevelModifiers,
        };
      }));
    }
    if (toPropagate.propagations && toPropagate.propagations.global)
    {
      propagations.push(...toPropagate.propagations.global.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: app.game.globalModifiers,
        };
      }));
    }
    if (toPropagate.propagations && toPropagate.propagations.owningPlayer)
    {
      propagations.push(...toPropagate.propagations.owningPlayer.map(modifierTemplate =>
      {
        return {
          template: modifierTemplate,
          target: this.owner.modifiers,
        };
      }));
    }

    return propagations;
  }
}
