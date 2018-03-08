import
{
  shallowCopy,
} from "./utility";


interface ObjectWithId
{
  id: number;
}

export class IdDictionary<K extends ObjectWithId, V>
{
  // prevents accidental assignment. don't think there's a way to prevent access completely
  readonly [id: number]: never;

  public get length(): number
  {
    return Object.keys(this.keysById).length;
  }

  private valuesById:
  {
    [id: number]: V;
  } = {};
  private keysById:
  {
    [id: number]: K;
  } = {};

  constructor(keys?: K[], getValueFN?: (key: K) => V)
  {
    if (keys && getValueFN)
    {
      keys.forEach(key =>
      {
        this.set(key, getValueFN(key));
      });
    }
  }

  public destroy(): void
  {
    this.forEach((k, v) =>
    {
      this.delete(k);
    });
  }
  public has(key: K): boolean
  {
    return Boolean(this.valuesById[key.id]);
  }
  public get(key: K): V | undefined
  {
    return this.valuesById[key.id];
  }
  public getById(id: number): V | undefined
  {
    return this.valuesById[id];
  }
  public set(key: K, value: V): void
  {
    this.valuesById[key.id] = value;
    this.keysById[key.id] = key;
  }
  public setIfDoesntExist(key: K, value: V): void
  {
    if (!this.keysById[key.id])
    {
      this.set(key, value);
    }
  }
  public delete(key: K): void
  {
    delete this.valuesById[key.id];
    delete this.keysById[key.id];
  }
  public forEach(callback: (key: K, value: V) => void): void
  {
    for (const id in this.keysById)
    {
      callback(this.keysById[id], this.valuesById[id]);
    }
  }
  public filter(filterFN: (key: K, value: V) => boolean): IdDictionary<K, V>
  {
    const filtered: IdDictionary<K, V> = new (this.constructor as any)();

    this.forEach((key, value) =>
    {
      if (filterFN(key, value))
      {
        filtered.set(key, value);
      }
    });

    return filtered;
  }
  public zip<T extends {[keyName: string]: K | V}>(
    keyName: string, valueName: string): T[]
  {
    const zipped: T[] = [];

    for (const id in this.keysById)
    {
      const zippedPair =
      {
        [keyName]: this.keysById[id],
        [valueName]: this.valuesById[id],
      };

      zipped.push(<T> zippedPair);
    }

    return zipped;
  }
  public toObject(): {[id: number]: V}
  {
    return shallowCopy(this.valuesById);
  }
  public sort(sortingFN: (a: V, b: V) => number): K[]
  {
    const keys: K[] = [];
    for (const id in this.keysById)
    {
      keys.push(this.keysById[id]);
    }

    keys.sort((a, b) =>
    {
      const sortingValue = sortingFN(this.valuesById[a.id], this.valuesById[b.id]);
      if (sortingValue)
      {
        return sortingValue;
      }
      else
      {
        return b.id - a.id;
      }
    });

    return keys;
  }
  public mapToArray<T>(mapFN: (key: K, value: V) => T): T[]
  {
    const mapped: T[] = [];

    this.forEach((k, v) =>
    {
      mapped.push(mapFN(k, v));
    });

    return mapped;
  }
  public merge<T extends IdDictionary<K, V>>(mergeFN: (...values: V[]) => V, ...toMerge: T[]): T
  {
    const merged: T = this.constructor();

    toMerge.forEach(dictToMerge =>
    {
      dictToMerge.filter((k, v) =>
      {
        return !merged.has(k);
      }).forEach(key =>
      {
        const allValues = toMerge.filter(dictToCheck =>
        {
          return dictToCheck.has(key);
        }).map(dictWithKey =>
        {
          return dictWithKey.get(key)!;
        });

        merged.set(key, mergeFN(...allValues));
      });
    });

    return merged;
  }
  public find(filterFN: (key: K, value: V) => boolean): K | null
  {
    for (const id in this.keysById)
    {
      if (filterFN(this.keysById[id], this.valuesById[id]))
      {
        return this.keysById[id];
      }
    }

    return null;
  }
  public some(filterFN: (key: K, value: V) => boolean): boolean
  {
    return Boolean(this.find(filterFN));
  }
}
