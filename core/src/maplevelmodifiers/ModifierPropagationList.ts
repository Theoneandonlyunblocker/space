import { MapLevelModifiersPropagation } from "./ModifierPropagation";
import { ModifierTemplate } from "./ModifierTemplate";


export class ModifierPropagationList<T extends ModifierTemplate<any>>
{
  private propagations: MapLevelModifiersPropagation<T, any>[] = [];

  constructor()
  {

  }

  public push(...items: MapLevelModifiersPropagation<T, any>[]): void
  {
    this.propagations.push(...items);
  }
  public forEach(callback: (item: MapLevelModifiersPropagation<T, any>) => void): void
  {
    this.propagations.forEach(callback);
  }
  public map<R>(callback: (item: MapLevelModifiersPropagation<T, any>) => R): R[]
  {
    return this.propagations.map(callback);
  }
  public filter(filter: (item: MapLevelModifiersPropagation<T, any>) => boolean): MapLevelModifiersPropagation<T, any>[]
  {
    return this.propagations.filter(filter);
  }
  public some(filter: (item: MapLevelModifiersPropagation<T, any>) => boolean): boolean
  {
    return this.propagations.some(filter);
  }

  public remove(toRemove: MapLevelModifiersPropagation<T, any>): void
  {
    this.filterAndRemove(propagation => propagation === toRemove);
  }
  public filterAndRemove(filterFN: (propagation: MapLevelModifiersPropagation<T, any>) => boolean): MapLevelModifiersPropagation<T, any>[]
  {
    const propagationsToKeep: MapLevelModifiersPropagation<T, any>[] = [];
    const removedPropagations: MapLevelModifiersPropagation<T, any>[] = [];

    this.propagations.forEach(propagation =>
    {
      if (filterFN(propagation))
      {
        removedPropagations.push(propagation);
      }
      else
      {
        propagationsToKeep.push(propagation);
      }
    });

    this.propagations = propagationsToKeep;

    return removedPropagations;
  }
}
