import { MapLevelModifiersPropagation } from "./ModifierPropagation";
import { Modifier } from "./Modifier";


export class ModifierPropagationList<T extends Modifier<any>>
{
  private propagations: MapLevelModifiersPropagation<T, any>[] = [];

  constructor()
  {

  }

  // tslint:disable member-ordering
  public push = this.propagations.push.bind(this.propagations);
  public forEach = this.propagations.forEach.bind(this.propagations);
  public filter = this.propagations.filter.bind(this.propagations);
  public some = this.propagations.some.bind(this.propagations);
  // tslint:enable member-ordering

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
