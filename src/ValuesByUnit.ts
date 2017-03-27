import {IDDictionary} from "./IDDictionary";
import Unit from "./Unit";

export default class ValuesByUnit<T> extends IDDictionary<Unit, T>
{
  constructor(units?: Unit[], getValueFN?: (unit: Unit) => T)
  {
    super(units, getValueFN);
  }
}
