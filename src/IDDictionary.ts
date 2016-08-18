interface ObjectWithID
{
  id: number;
}

abstract class IDDictionary<K extends ObjectWithID, V, Z>
{
  [id: number]: V;

  private keyName: string;
  private valueName: string;
  private keysByID:
  {
    [id: number]: K;
  };

  constructor(keyName: string, valueName: string,
    keys: K[], getValueFN: (key: K) => V)
  {
    this.keyName = keyName;
    this.valueName = valueName;
    
    this.keysByID = {};

    for (let property in this)
    {
      Object.defineProperty(this, property,
      {
        enumerable: false
      });
    }

    keys.forEach(key =>
    {
      this.keysByID[key.id] = key;
      this[key.id] = getValueFN(key);
    });
  }

  public zip(): Z[]
  {
    const zipped: Z[] = [];

    for (let key in this.keysByID)
    {
      const zippedPair = <Z>
      {
        [this.keyName]: this.keysByID[key],
        [this.valueName]: this[key]
      };
    }

    return zipped;
  }
}

export default IDDictionary;
