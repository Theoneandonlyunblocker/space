interface ObjectWithID
{
  id: number;
}

abstract class IDDictionary<K extends ObjectWithID, V, Z>
{
  readonly [a: number]: boolean;
  protected keyName: string;
  protected valueName: string;
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

  public get(key: K): V
  {
    return this.valuesByID[key.id];
  }
  public getByID(id: number): V
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
  public zip(): Z[]
  {
    const zipped: Z[] = [];

    for (let key in this.keysByID)
    {
      const zippedPair =
      {
        [this.keyName]: this.keysByID[key],
        [this.valueName]: this.valuesByID[key]
      };

      zipped.push(<any>zippedPair);
    }

    return zipped;
  }
}

export default IDDictionary;
