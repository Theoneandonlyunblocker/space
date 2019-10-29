import { ModifierTemplate } from "./ModifierTemplate";
import { MapLevelModifiersCollection } from "./MapLevelModifiersCollection";


export class Modifier<T extends ModifierTemplate<any>>
{
  public readonly parent: Modifier<any>;
  public readonly template: T;
  public readonly collection: MapLevelModifiersCollection<T>;
  public isActive: boolean = false;

  constructor(
    template: T,
    collection: MapLevelModifiersCollection<T>,
    parent?: Modifier<any>,
  )
  {
    this.parent = parent;
    this.collection = collection;
    this.template = template;
  }
}
