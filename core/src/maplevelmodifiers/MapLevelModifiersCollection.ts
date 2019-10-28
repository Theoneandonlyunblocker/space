import { ModifierTemplate } from "./ModifierTemplate";
import { MapLevelModifiersPropagation, PropagationTypes, SimpleMapLevelModifiersPropagation } from "./ModifierPropagation";
import { ModifierPropagationList } from "./ModifierPropagationList";
import { Modifier } from "./Modifier";


type Unpacked<T> = T extends (infer U)[] ? U : T;

export abstract class MapLevelModifiersCollection<T extends ModifierTemplate<any>>
{
  private readonly originatingModifiers: Modifier<T>[] = [];
  private incomingModifiers: ModifierPropagationList<T> = new ModifierPropagationList<T>();
  private propagations: ModifierPropagationList<T> = new ModifierPropagationList<T>();

  constructor()
  {

  }

  public addOriginatingModifiers(...modifierTemplates: T[]): void
  {
    modifierTemplates.forEach(modifierTemplate =>
    {
      const modifier = new Modifier(
        modifierTemplate,
      );
      this.originatingModifiers.push(modifier);
    });

    this.recheckAllModifiers();
  }
  public getAllActiveModifiers(): Modifier<T>[]
  {
    const allModifiers = this.getAllModifiers();
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
  public recheckAllModifiers(
    updateChain: {[modifierKey: string]: Modifier<T>}[] = [],
  ): void
  {
    const updateDepth = updateChain.length;
    const maxUpdateDepth = 1000;
    if (updateDepth > maxUpdateDepth)
    {
      console.error(updateChain);
      throw new Error(`Reached maximum update depth (${maxUpdateDepth}) when updating modifiers`);
    }

    const changedModifiersByKey:
    {
      [modifierKey: string]: Modifier<T>;
    } = {};

    this.getAllModifiers().forEach(modifier =>
    {
      const modifierShouldBeActive = this.templateShouldBeActive(modifier.template);
      if (!modifier.isActive && modifierShouldBeActive)
      {
        modifier.isActive = true;
        if (!this.hasPropagatedModifier(modifier))
        {
          this.propagateModifier(modifier, updateChain);
        }
        changedModifiersByKey[modifier.template.key] = modifier;
      }
      else if (modifier.isActive && !modifierShouldBeActive)
      {
        modifier.isActive = false;
        if (this.hasPropagatedModifier(modifier))
        {
          this.removePropagationsForModifier(modifier, updateChain);
        }
        changedModifiersByKey[modifier.template.key] = modifier;
      }
    });

    const modifiersDidChange = Object.keys(changedModifiersByKey).length > 0;
    if (modifiersDidChange)
    {
      this.recheckAllModifiers([...updateChain, changedModifiersByKey]);
    }
  }
  public removePropagationsTo(target: MapLevelModifiersCollection<any>): void
  {
    const toRemove = this.propagations.filterAndRemove(propagation => propagation.target === target);
    toRemove.forEach(propagation =>
    {
      target.removeIncomingModifier(propagation);
    });
  }
  public propagateModifiersOfTypeTo<K extends PropagationTypes<T>>(propagationType: K, target: MapLevelModifiersCollection<Unpacked<T["propagations"][K]>>): void
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

  protected abstract templateShouldBeActive(template: T): boolean;
  protected abstract getPropagationsForTemplate(templateToPropagate: T): SimpleMapLevelModifiersPropagation<T>[];

  private getAllModifiers(): Modifier<T>[]
  {
    return [
      ...this.originatingModifiers,
      ...this.incomingModifiers.map(propagation => propagation.modifier),
    ];
  }
  private incomingModifierFormsCycle(toCheck: MapLevelModifiersPropagation<T, any>): boolean
  {
    return this.incomingModifiers.some(propagation =>
    {
      return propagation.modifier.parent === toCheck.modifier.parent && propagation.modifier.template.key === toCheck.modifier.template.key;
    });
  }
  private addIncomingModifier(
    propagation: MapLevelModifiersPropagation<T, any>,
    updateChain?: {[modifierKey: string]: Modifier<T>}[],
  ): void
  {
    if (this.incomingModifierFormsCycle(propagation))
    {
       // TODO 2019.10.10 | better error message
      throw new Error("Cycle detected in map level modifiers");
    }

    this.incomingModifiers.push(propagation);
    this.recheckAllModifiers(updateChain);
  }
  private hasPropagatedModifier(modifier: Modifier<T>): boolean
  {
    return this.propagations.some(propagation => propagation.modifier === modifier);
  }
  private removePropagationsForModifier(
    modifier: Modifier<T>,
    updateChain?: {[modifierKey: string]: Modifier<T>}[],
  ): void
  {
    const removedPropagations = this.propagations.filterAndRemove(propagation => propagation.modifier === modifier);
    const removedPropagation = removedPropagations[0];
    removedPropagation.target.removeIncomingModifier(removedPropagation, updateChain);
  }
  private propagateModifier(
    modifier: Modifier<T>,
    updateChain?: {[modifierKey: string]: Modifier<T>}[],
  ): void
  {
    if (this.hasPropagatedModifier(modifier))
    {
      throw new Error(`Has already propagated modifier ${modifier.template.key}`);
    }
    const allPropagations = this.getPropagationsForTemplate(modifier.template);
    this.applySimplePropagations(allPropagations, modifier, updateChain);
  }
  private applySimplePropagations(
    simplePropagations: SimpleMapLevelModifiersPropagation<T>[],
    parent: Modifier<T>,
    updateChain?: {[modifierKey: string]: Modifier<T>}[],
    ): void
  {
    simplePropagations.forEach(simplePropagation =>
    {
      const propagation =
      {
        target: simplePropagation.target,
        modifier: new Modifier(
          simplePropagation.template,
          parent,
        ),
      };

      this.propagations.push(propagation);
      propagation.target.addIncomingModifier(propagation, updateChain);
    });
  }
  private removeOriginatingModifier(modifier: Modifier<T>): void
  {
    if (this.hasPropagatedModifier(modifier))
    {
      this.removePropagationsForModifier(modifier);
    }
    const index = this.originatingModifiers.indexOf(modifier);
    this.originatingModifiers.splice(index, 1);
    this.recheckAllModifiers();
  }
  private removeIncomingModifier(
    propagation: MapLevelModifiersPropagation<T, any>,
    updateChain?: {[modifierKey: string]: Modifier<T>}[],
  ): void
  {
    if (this.hasPropagatedModifier(propagation.modifier))
    {
      this.removePropagationsForModifier(propagation.modifier);
    }
    this.incomingModifiers.remove(propagation);
    this.recheckAllModifiers(updateChain);
  }
}
