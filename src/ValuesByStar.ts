import Star from "./Star";
import IDDictionary from "./IDDictionary";

interface Zipped<T>
{
  star: Star;
  value: T;
}

export default class ValuesByStar<T> extends IDDictionary<Star, T, Zipped<T>>
{
  [starID: number]: T;

  constructor(stars: Star[], getValueFN: (star: Star) => T)
  {
    super("star", "value", stars, getValueFN);
  }
}
