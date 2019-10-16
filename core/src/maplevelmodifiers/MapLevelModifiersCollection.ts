import { Modifier } from "./Modifier";
import { MapLevelModifiersPropagation, PropagationTypes, MapLevelModifiersPropagationWithoutId } from "./ModifierPropagation";
import { ModifierPropagationList } from "./ModifierPropagationList";

// doesn't need to be consistent across saves so just store here
let modifierIdGenerator: number = 0;

export abstract class MapLevelModifiersCollection<T extends Modifier>
{
  private readonly originatingModifiers:
  {
    [modifierId: number]: Modifier;
  } = {};
  private incomingModifiers: ModifierPropagationList<T> = new ModifierPropagationList<T>();
  private propagations: ModifierPropagationList<T> = new ModifierPropagationList<T>();

  constructor()
  {

  }

  public addOriginatingModifier(modifier: T, id: number = modifierIdGenerator++): void
  {
    this.originatingModifiers[id] = modifier;
    if (this.modifierPassesFilter(modifier))
    {
      this.propagateModifier(modifier, id);
    }
  }
  public getAllActiveModifiers(): T[]
  {
    return this.getAllActiveModifiersWithIds().map(modifierWithId => modifierWithId.modifier);
  }
  public removeAllOriginatingModifiers(): void
  {
    Object.keys(this.originatingModifiers).forEach(id => this.removeOriginatingModifier(Number(id)));
  }
  public removeAllIncomingModifiers(): void
  {
    this.incomingModifiers.forEach(modifier => this.removeIncomingModifier(modifier));
  }
  public removeAllModifiers(): void
  {
    this.removeAllOriginatingModifiers();
    this.removeAllIncomingModifiers();
  }
  public recheckIncomingModifiers(): void
  {
    this.incomingModifiers.forEach(propagation =>
    {
      if (!this.modifierPassesFilter(propagation.modifier))
      {
        if (this.hasPropagatedModifier(propagation.modifierId))
        {
          this.removePropagationsForModifier(propagation.modifierId)
        }
      }
      else
      {
        if (!this.hasPropagatedModifier(propagation.modifierId))
        {
          this.propagateModifier(propagation.modifier, propagation.modifierId);
        }
      }
    });
  }
  public removePropagationsTo(target: MapLevelModifiersCollection<any>): void
  {
    const toRemove = this.propagations.filterAndRemove(propagation => propagation.target === target);
    toRemove.forEach(propagation =>
    {
      target.removeIncomingModifier(propagation);
    });
  }
  public propagateModifiersOfTypeTo<K extends PropagationTypes<T>>(propagationType: K, target: MapLevelModifiersCollection<T[K]>): void
  {
    const modifiersWithIdsToPropagate = this.getAllActiveModifiersWithIds().filter(modifierWithId =>
    {
      return modifierWithId.modifier[propagationType];
    });

    modifiersWithIdsToPropagate.forEach(modifierWithId =>
    {
      const {modifier, id} = modifierWithId;

      const propagations = this.getPropagationsFor(modifier).filter(propagation => propagation.targetType === propagationType);
      propagations.forEach(propagationWithoutId =>
      {
        const propagation = {...propagationWithoutId, modifierId: id};
        target.addIncomingModifier(propagation);
      });
    });
  }
  public propagateOriginatedModifiers(): void
  {
    for (const id in this.originatingModifiers)
    {
      this.propagateModifier(this.originatingModifiers[id], Number(id));
    }
  }
  public depropagateOriginatedModifiers(): void
  {
    for (const id in this.originatingModifiers)
    {
      this.removePropagationsForModifier(Number(id));
    }
  }

  protected abstract getPropagationsFor(toPropagate: T): MapLevelModifiersPropagationWithoutId<T>[];
  protected abstract modifierPassesFilter(modifier: T): boolean;

  private incomingModifierFormsCycle(toCheck: MapLevelModifiersPropagation<T>): boolean
  {
    return this.incomingModifiers.some(propagation =>
    {
      return propagation.modifierId === toCheck.modifierId && propagation.targetType === toCheck.targetType;
    });
  }
  private addIncomingModifier(propagation: MapLevelModifiersPropagation<T>): void
  {
    if (this.incomingModifierFormsCycle(propagation))
    {
       // TODO 2019.10.10 | better error message
      throw new Error("Cycle detected in map level modifiers");
    }

    this.incomingModifiers.push(propagation);
    if (this.modifierPassesFilter(propagation.modifier))
    {
      this.propagateModifier(propagation.modifier, propagation.modifierId);
    }
  }
  private hasPropagatedModifier(id: number): boolean
  {
    return this.propagations.some(propagation => propagation.modifierId === id);
  }
  private removePropagationsForModifier(id: number): void
  {
    this.propagations.filterAndRemove(propagation => propagation.modifierId === id);
  }
  private propagateModifier(modifier: T, id: number): void
  {
    const allPropagations = this.getPropagationsFor(modifier);
    allPropagations.forEach(propagationWithoutId =>
    {
      const propagation = {...propagationWithoutId, modifierId: id};
      propagation.target.addIncomingModifier(propagation);
      this.propagations.push(propagation);
    });
  }
  private getAllActiveModifiersWithIds(): {modifier: T, id: number}[]
  {
    const allModifiersWIthIds: {modifier: T, id: number}[] = [];

    for (const id in this.originatingModifiers)
    {
      allModifiersWIthIds.push({modifier: this.originatingModifiers[id], id: Number(id)});
    }
    this.incomingModifiers.forEach(propagation =>
    {
      allModifiersWIthIds.push({modifier: propagation.modifier, id: propagation.modifierId});
    });

    const activeModifiers = allModifiersWIthIds.filter(modifierWithId => this.modifierPassesFilter(modifierWithId.modifier));

    return activeModifiers;
  }
  private removeOriginatingModifier(id: number): void
  {
    this.removePropagationsForModifier(id);
    delete this.originatingModifiers[id];
  }
  private removeIncomingModifier(propagation: MapLevelModifiersPropagation<T>): void
  {
    this.removePropagationsForModifier(propagation.modifierId);
    this.incomingModifiers.remove(propagation);
  }
}
