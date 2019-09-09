import {IdDictionary} from "../generic/IdDictionary";
import {Unit} from "./Unit";


export class ValuesByUnit<T> extends IdDictionary<Unit, T>
{
  constructor(units?: Unit[], getValueFN?: (unit: Unit) => T)
  {
    super(units, getValueFN);
  }
}
