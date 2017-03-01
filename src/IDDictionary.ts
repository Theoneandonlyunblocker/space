interface ObjectWithID
{
  id: number;
}

export default class IDDictionary<K extends ObjectWithID, V>
{
  readonly [a: number]: boolean; // TODO 24.02.2017 | what is this? legacy?
  private valuesByID:
  {
    [id: number]: V;
  } = {};
  private keysByID:
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
    return Boolean(this.valuesByID[key.id]);
  }
  public get(key: K): V | undefined
  {
    return this.valuesByID[key.id];
  }
  public getByID(id: number): V | undefined
  {
    return this.valuesByID[id];
  }
  public set(key: K, value: V): void
  {
    this.valuesByID[key.id] = value;
    this.keysByID[key.id] = key;
  }
  public setIfDoesntExist(key: K, value: V): void
  {
    if (!this.keysByID[key.id])
    {
      this.set(key, value);
    }
  }
  public delete(key: K): void
  {
    delete this.valuesByID[key.id];
    delete this.keysByID[key.id];
  }

  public forEach(callback: (key: K, value: V) => void): void
  {
    for (let ID in this.keysByID)
    {
      callback(this.keysByID[ID], this.valuesByID[ID]);
    }
  }
  public filter(filterFN: (key: K, value: V) => boolean): IDDictionary<K, V>
  {
    const filtered: IDDictionary<K, V> = this.constructor();

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

    for (let id in this.keysByID)
    {
      const zippedPair =
      {
        [keyName]: this.keysByID[id],
        [valueName]: this.valuesByID[id],
      };

      zipped.push(<any>zippedPair);
    }

    return zipped;
  }
  public sort(sortingFN: (a: V, b: V) => number): K[]
  {
    const keys: K[] = [];
    for (let id in this.keysByID)
    {
      keys.push(this.keysByID[id]);
    }

    keys.sort((a, b) =>
    {
      const sortingValue = sortingFN(this.valuesByID[a.id], this.valuesByID[b.id]);
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
  public map<T>(mapFN: (key: K, value: V) => T): T[]
  {
    const mapped: T[] = [];

    for (let ID in this.keysByID)
    {
      mapped.push(mapFN(this.keysByID[ID], this.valuesByID[ID]));
    }

    return mapped;
  }
  public merge<T extends IDDictionary<K, V>>(mergeFN: (...values: V[]) => V, ...toMerge: T[]): T
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
