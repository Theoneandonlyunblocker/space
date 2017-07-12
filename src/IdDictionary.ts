interface ObjectWithId
{
  id: number;
}

export class IdDictionary<K extends ObjectWithId, V>
{
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
    if (keys)
    {
      keys.forEach(key =>
      {
        this.set(key, getValueFN(key));
      });
    }
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
    for (let Id in this.keysById)
    {
      callback(this.keysById[Id], this.valuesById[Id]);
    }
  }
  public filter(filterFN: (key: K, value: V) => boolean): IdDictionary<K, V>
  {
    const filtered: IdDictionary<K, V> = this.constructor();

    this.forEach((key, value) =>
    {
      if (filterFN(key, value))
      {
        filtered.set(key, value);
      }
    });

    return filtered;
  }
  public zip<T extends {[keyName: string]: K | V;}>(
    keyName: string, valueName: string): T[]
  {
    const zipped: T[] = [];

    for (let id in this.keysById)
    {
      const zippedPair =
      {
        [keyName]: this.keysById[id],
        [valueName]: this.valuesById[id],
      };

      zipped.push(<T>zippedPair);
    }

    return zipped;
  }
  public sort(sortingFN: (a: V, b: V) => number): K[]
  {
    const keys: K[] = [];
    for (let id in this.keysById)
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
          return dictWithKey.get(key);
        });

        merged.set(key, mergeFN(...allValues));
      });
    });

    return merged;
  }
}
