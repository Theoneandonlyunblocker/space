import { ModifierTemplate } from "./ModifierTemplate";
import { MapLevelModifiersPropagation, PropagationTypes, SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { ModifierPropagationList } from "./ModifierPropagationList";
import { Modifier } from "./Modifier";


export abstract class MapLevelModifiersCollection<T extends ModifierTemplate<any>>
{
  private readonly originatingModifiers: Modifier<T>[] = [];
  private incomingModifiers: ModifierPropagationList<T> = new ModifierPropagationList<T>();
  private propagations: ModifierPropagationList<T> = new ModifierPropagationList<T>();

  constructor()
  {

  }

  public addOriginatingModifier(modifierTemplate: T): void
  {
    const modifier = new Modifier(
      modifierTemplate,
      this.templateShouldBeActive(modifierTemplate),
    );
    this.originatingModifiers.push(modifier);
  }
  public getAllActiveModifiers(): Modifier<T>[]
  {
    const allModifiers: Modifier<T>[] =
    [
      ...this.originatingModifiers,
      ...this.incomingModifiers.map(propagation => propagation.modifier),
    ];

    const activeModifiers = allModifiers.filter(modifier => modifier.isActive);

    return activeModifiers;
  }
  public printAllActiveModifiers(): string
  {
    return this.getAllActiveModifiers().map(modifier =>
    {
      return modifier.template.key;
    }).join("\n");
  }
  public removeAllOriginatingModifiers(): void
  {
    this.originatingModifiers.forEach(modifier => this.removeOriginatingModifier(modifier));
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
      if (!this.templateShouldBeActive(propagation.modifier.template))
      {
        propagation.modifier.isActive = true;
        if (this.hasPropagatedModifier(propagation.modifier))
        {
          this.removePropagationsForModifier(propagation.modifier)
        }
      }
      else
      {
        propagation.modifier.isActive = false;
        if (!this.hasPropagatedModifier(propagation.modifier))
        {
          this.propagateModifier(propagation.modifier);
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
  public propagateModifiersOfTypeTo<K extends PropagationTypes<T>>(propagationType: K, target: MapLevelModifiersCollection<T["propagations"][K]>): void
  {
    const modifiersWithMatchingPropagation = this.getAllActiveModifiers().filter(modifier =>
    {
      return modifier.template.propagations && modifier.template.propagations[propagationType];
    });

    modifiersWithMatchingPropagation.forEach(modifier =>
    {
      const propagationsToTarget = this.getPropagationsForTemplate(modifier.template).filter(propagation => propagation.target === target);
      this.applySimplePropagations(propagationsToTarget, modifier);
    });
  }
  public propagateOriginatedModifiers(): void
  {
    this.originatingModifiers.forEach(modifier => this.propagateModifier(modifier));
  }
  public depropagateOriginatedModifiers(): void
  {
    this.originatingModifiers.forEach(modifier => this.removePropagationsForModifier(modifier));
  }

  protected abstract templateShouldBeActive(template: T): boolean;
  protected abstract getPropagationsForTemplate(templateToPropagate: T): SimpleMapLevelModifiersPropagation<T>[];

  private incomingModifierFormsCycle(toCheck: MapLevelModifiersPropagation<T, any>): boolean
  {
    return this.incomingModifiers.some(propagation =>
    {
      return propagation.modifier.parent === toCheck.modifier.parent && propagation.modifier.template.key === toCheck.modifier.template.key;
    });
  }
  private addIncomingModifier(propagation: MapLevelModifiersPropagation<T, any>): void
  {
    if (this.incomingModifierFormsCycle(propagation))
    {
       // TODO 2019.10.10 | better error message
      throw new Error("Cycle detected in map level modifiers");
    }

    this.incomingModifiers.push(propagation);
    if (propagation.modifier.isActive)
    {
      this.propagateModifier(propagation.modifier);
    }
  }
  private hasPropagatedModifier(modifier: Modifier<T>): boolean
  {
    return this.propagations.some(propagation => propagation.modifier === modifier);
  }
  private removePropagationsForModifier(modifier: Modifier<T>): void
  {
    this.propagations.filterAndRemove(propagation => propagation.modifier === modifier);
  }
  private propagateModifier(modifier: Modifier<T>): void
  {
    const allPropagations = this.getPropagationsForTemplate(modifier.template);
    this.applySimplePropagations(allPropagations, modifier);
  }
  private applySimplePropagations(simplePropagations: SimpleMapLevelModifiersPropagation<T>[], parent: Modifier<T>): void
  {
    simplePropagations.forEach(simplePropagation =>
    {
      const propagation =
      {
        target: simplePropagation.target,
        modifier: new Modifier(
          simplePropagation.template,
          simplePropagation.target.templateShouldBeActive(simplePropagation.template),
          parent,
        ),
      };

      propagation.target.addIncomingModifier(propagation);
      this.propagations.push(propagation);
    });
  }
  private removeOriginatingModifier(modifier: Modifier<T>): void
  {
    this.removePropagationsForModifier(modifier);
    const index = this.originatingModifiers.indexOf(modifier);
    this.originatingModifiers.splice(index, 1);
  }
  private removeIncomingModifier(propagation: MapLevelModifiersPropagation<T, any>): void
  {
    this.removePropagationsForModifier(propagation.modifier);
    this.incomingModifiers.remove(propagation);
  }
}
