import {IDDictionary} from "./IDDictionary";
import Star from "./Star";

export default class ValuesByStar<T> extends IDDictionary<Star, T>
{
  constructor(stars?: Star[], getValueFN?: (star: Star) => T)
  {
    super(stars, getValueFN);
  }
}
