import Star from "./Star";
import IDDictionary from "./IDDictionary";

export default class ValuesByStar<T> extends IDDictionary<Star, T>
{
  constructor(stars?: Star[], getValueFN?: (star: Star) => T)
  {
    super(stars, getValueFN);
  }
}
