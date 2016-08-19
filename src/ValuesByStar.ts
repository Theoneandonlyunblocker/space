import Star from "./Star";
import IDDictionary from "./IDDictionary";

interface StarWithvalue<T>
{
  star: Star;
  value: T;
}

export default class ValuesByStar<T> extends IDDictionary<Star, T, StarWithvalue<T>>
{
  constructor(stars?: Star[], getValueFN?: (star: Star) => T)
  {
    super(stars, getValueFN);
    this.keyName = "star";
    this.valueName = "value";
  }
}
