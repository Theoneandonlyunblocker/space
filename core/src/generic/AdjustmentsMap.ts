import { FlatAndMultiplierAdjustment, getBaseAdjustment, squashFlatAndMultiplierAdjustments, applyFlatAndMultiplierAdjustments } from "./FlatAndMultiplierAdjustment";
import { MapBase } from "./MapBase";


export class AdjustmentsMap<Key> extends MapBase<
  Key,
  FlatAndMultiplierAdjustment,
  Partial<FlatAndMultiplierAdjustment>
>
{
  constructor()
  {
    super();
  }

  public map<NewKey>(
    mapFn: (key: Key) => NewKey,
  ): AdjustmentsMap<NewKey>
  {
    return super.mapRaw(mapFn) as AdjustmentsMap<NewKey>;
  }
  public resolve(): Map<Key, number>
  {
    const resolved = new Map<Key, number>();

    this.forEach((key, adjustment) =>
    {
      const resolvedAdjustment = applyFlatAndMultiplierAdjustments(0, adjustment);
      resolved.set(key, resolvedAdjustment);
    });

    return resolved;
  }

  // tslint:disable-next-line: prefer-function-over-method
  protected getDefaultValue(key: Key): FlatAndMultiplierAdjustment
  {
    return getBaseAdjustment();
  }
  // tslint:disable-next-line: prefer-function-over-method
  protected squashValues(
    existing: FlatAndMultiplierAdjustment,
    toSquash: Partial<FlatAndMultiplierAdjustment>,
  ): FlatAndMultiplierAdjustment
  {
    return squashFlatAndMultiplierAdjustments(existing, toSquash);
  }
}
