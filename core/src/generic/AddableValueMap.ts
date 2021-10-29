// TODO 2020.02.19 | probably a few classes that could be converted to use this
export abstract class AddableValueMap<
  Key,
  Value extends AddableValue,
  AddableValue,
>
{
  private readonly _map: Map<Key, Value> = new Map();

  constructor()
  {

  }

  public get(key: Key): Value
  {
    if (this._map.has(key))
    {
      return this._map.get(key);
    }
    else
    {
      return this.getDefaultValue(key);
    }
  }
  public add(key: Key, toAdd: AddableValue): void
  {
    const existing = this.get(key);
    const squashed = this.squashValues(existing, toAdd);
    this._map.set(key, squashed);
  }
  public forEach(callback: (key: Key, value: Value) => void): void
  {
    this._map.forEach((value, key) => callback(key, value));
  }
  public filter(filterFn: (key: Key, value: Value) => boolean): this
  {
    const filtered = this.constructor();

    this.forEach((key, value) =>
    {
      if (filterFn(key, value))
      {
        filtered.add(key, value);
      }
    });

    return <any>filtered;
  }

  // should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/14600
  protected abstract getDefaultValue(key: Key): Value;
  protected abstract squashValues(existing: Value, toSquash: AddableValue): Value;

  // don't think it's possible to type this polymorphically without higher kinded types
  // child class should define correct type signature and call this
  protected mapRaw<NewKey>(
    mapFn: (key: Key) => NewKey,
  ): AddableValueMap<NewKey, Value, AddableValue>
  {
    const mapped: AddableValueMap<NewKey, Value, AddableValue> = this.constructor();

    this.forEach((key, value) =>
    {
      mapped.add(mapFn(key), value);
    });

    return mapped;
  }
}
