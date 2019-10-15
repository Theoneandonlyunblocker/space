import { MapLevelModifiersPropagation } from "./ModifierPropagation";
import { Modifiers } from "./Modifiers";


export class ModifierPropagationList<T extends Modifiers>
{
  private propagations: MapLevelModifiersPropagation<T>[] = [];

  constructor()
  {

  }

  // tslint:disable member-ordering
  public push = this.propagations.push.bind(this.propagations);
  public forEach = this.propagations.forEach.bind(this.propagations);
  public filter = this.propagations.filter.bind(this.propagations);
  public some = this.propagations.some.bind(this.propagations);
  // tslint:enable member-ordering

  public remove(toRemove: MapLevelModifiersPropagation<T>): void
  {
    this.filterAndRemove(propagation => propagation === toRemove);
  }
  public filterAndRemove(filterFN: (propagation: MapLevelModifiersPropagation<T>) => boolean): MapLevelModifiersPropagation<T>[]
  {
    const propagationsToKeep: MapLevelModifiersPropagation<T>[] = [];
    const removedPropagations: MapLevelModifiersPropagation<T>[] = [];

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
