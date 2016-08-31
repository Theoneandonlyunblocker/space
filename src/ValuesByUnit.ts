import Unit from "./Unit";
import IDDictionary from "./IDDictionary";

export default class ValuesByUnit<T> extends IDDictionary<Unit, T>
{
  constructor(units?: Unit[], getValueFN?: (unit: Unit) => T)
  {
    super(units, getValueFN);
  }
}
